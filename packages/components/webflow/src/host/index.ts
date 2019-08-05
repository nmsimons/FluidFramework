/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { PrimedComponent, SharedComponentFactory } from "@prague/aqueduct";
import { IComponent, IComponentHTMLOptions, IComponentHTMLView, IComponentHTMLVisual } from "@prague/component-core-interfaces";
import { MapExtension } from "@prague/map";
import { IComponentContext, IComponentRuntime } from "@prague/runtime-definitions";
import { FlowDocument } from "../document";
import { WebflowView } from "./host";
import { importDoc } from "./template";

export class WebFlow extends PrimedComponent implements IComponentHTMLVisual {
    public static readonly type = "@chaincode/webflow";

    public constructor(runtime: IComponentRuntime, context: IComponentContext) {
        super(runtime, context);
    }

    public get IComponentHTMLVisual() { return this; }
    public get IComponentHTMLRender() { return this; }

    // #region IComponentHTMLVisual
    public addView?(scope?: IComponent): IComponentHTMLView {
        return new WebflowView(this.getComponent<FlowDocument>(this.docId));
    }

    public render(elm: HTMLElement, options?: IComponentHTMLOptions): void {
        const view = this.addView();
        view.render(elm, options);
    }
    // #endregion IComponentHTMLVisual

    protected async componentInitializingFirstTime() {
        const docP = this.createAndAttachComponent<FlowDocument>(this.docId, FlowDocument.type);
        const url = new URL(window.location.href);
        const template = url.searchParams.get("template");
        if (template) {
            importDoc(docP, template);
        }
    }

    private get docId() { return `${this.runtime.id}-doc`; }
}

export const webFlowFactory = new SharedComponentFactory(WebFlow, [new MapExtension()]);
