import { Context, DdcItem } from "https://deno.land/x/ddc_vim@v3.4.0/types.ts";
import { BaseUi } from "https://deno.land/x/ddc_vim@v3.4.0/base/ui.ts";
import {
  autocmd,
  Denops,
  fn,
} from "https://deno.land/x/ddc_vim@v3.4.0/deps.ts";

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
    if (await args.denops.call("pum#entered") as boolean) {
      return;
    }

    await args.denops.call(
      "pum#open",
      args.completePos + 1,
      args.items,
      await fn.mode(args.denops),
      args.uiParams.insert,
    );
  }

  override async hide(args: {
    denops: Denops;
  }): Promise<void> {
    await args.denops.call("pum#close");
  }

  override async visible(args: {
    denops: Denops;
  }): Promise<boolean> {
    return await args.denops.call("pum#visible") as boolean;
  }

  override params(): Params {
    return {
      insert: false,
    };
  }
}
