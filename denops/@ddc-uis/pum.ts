import { Context, DdcItem } from "https://deno.land/x/ddc_vim@v3.4.0/types.ts";
import { BaseUi } from "https://deno.land/x/ddc_vim@v3.4.0/base/ui.ts";
import { autocmd, Denops } from "https://deno.land/x/ddc_vim@v3.4.0/deps.ts";

export type Params = Record<never, never>;

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
    await args.denops.call(
      "pum#open",
      args.completePos + 1,
      args.items,
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
    return {};
  }
}
