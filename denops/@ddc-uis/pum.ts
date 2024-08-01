import { type Context, type DdcItem } from "jsr:@shougo/ddc-vim@6.0.0/types";
import { BaseUi } from "jsr:@shougo/ddc-vim@6.0.0/ui";

import type { Denops } from "jsr:@denops/core@^7.0.0";

import * as fn from "jsr:@denops/std@7.0.1/function";
import * as autocmd from "jsr:@denops/std@7.0.1/autocmd";

export type Params = {
  insert: boolean;
};

export class Ui extends BaseUi<Params> {
  override async onInit(args: {
    denops: Denops;
  }) {
    await autocmd.group(
      args.denops,
      "ddc-ui-pum",
      (helper: autocmd.GroupHelper) => {
        helper.define(
          "User",
          "PumCompleteDone",
          "call ddc#on_complete_done(g:pum#completed_item)",
        );
      },
    );
  }

  override async skipCompletion(args: {
    denops: Denops;
  }): Promise<boolean> {
    return await args.denops.call("pum#skip_complete") as boolean;
  }

  override async show(args: {
    denops: Denops;
    context: Context;
    completePos: number;
    items: DdcItem[];
    uiParams: Params;
  }): Promise<void> {
    // Skip if item is selected
    if (
      args.context.event === "Update" &&
      await args.denops.call("pum#entered") as boolean
    ) {
      return;
    }

    // Set dup attribute
    const items = args.items.map((item) => (
      {
        ...item,
        dup: true,
      }
    ));

    await args.denops.call(
      "pum#open",
      args.completePos + 1,
      items,
      await fn.mode(args.denops),
      args.uiParams.insert,
    );

    if (args.context.event === "Manual" && args.context.mode === "t") {
      // NOTE: Must skip the next complete in terminal mode
      await args.denops.call("pum#_inc_skip_complete");
    }
  }

  override async hide(args: {
    denops: Denops;
  }): Promise<void> {
    await args.denops.call("pum#close");
  }

  override async visible(args: {
    denops: Denops;
  }): Promise<boolean> {
    return Boolean(await args.denops.call("pum#visible"));
  }

  override params(): Params {
    return {
      insert: false,
    };
  }
}
