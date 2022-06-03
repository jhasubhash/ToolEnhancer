import React, {useEffect, useRef, useState, useCallback} from "react";
import { WC } from "./WC.jsx";
import { FillCommand, DiselectCommand, ClearCommand } from "./Command.jsx";

const action = require('photoshop').action;
let autoLassoFillEnabled = false;
let autoLassoClearEnabled = false;
let lastActionLasso = false;

export const MenuListView = () => {
    const lassoFillRef = useRef(null);
    const lassoClearRef = useRef(null);
    const [autoLassoFill, setAutoLassoFill] = useState(false);
    const [autoLassoClear, setAutoLassoClear] = useState(false);
    const [lassoDefault, setLassoDefault] = useState(false);
     
    useEffect(() => {
        autoLassoFillEnabled = autoLassoFill;
        autoLassoClearEnabled = autoLassoClear;
    }, [autoLassoFill, autoLassoClear])
     

    const onMenuItemChange = (evt) => {
        const target = evt.target;
        const part = target.getAttribute("data-part");
        switch (part) {
            case "LF":
                setAutoLassoFill(target.checked);
                break;
            case "LC":
                setAutoLassoClear(target.checked);
                break;
            case "LL":
                setLassoDefault(target.checked);
                break;
            default:
                break;
        }
    }

    const fillAndDiselect = async () => {
        await FillCommand();
        await DiselectCommand();
    }

    const clearAndDiselect = async () => {
        await ClearCommand();
        await DiselectCommand();
    }

    function listener(e,d) {
        if((e === "toolModalStateChanged" && d.selectedTool && d.selectedTool.title.includes("Lasso Tool"))){
            if(d.state._value === "enter"){
                lastActionLasso = false;
            } else if(d.state._value === "exit"){
                lastActionLasso = true;
            }
        } else if(e === "set" &&  d.to && d.to._obj === "polygon" && lastActionLasso){
            lastActionLasso = false;
            if(autoLassoFillEnabled){
                fillAndDiselect();
            } else if(autoLassoClearEnabled){
                clearAndDiselect();
            }
        } else {
            lastActionLasso = false;
        }
    };

    useEffect(() => {
        action.addNotificationListener([
            {
                event: "toolModalStateChanged"
            },
            {
                event: "set"
            }
        ], listener);
      return () => {
        action.removeNotificationListener([
            {
                event: "toolModalStateChanged"
            }
        ], listener);
      }
    }, [])
    
    return (
        <>
        <WC onInput={onMenuItemChange}>
            <sp-radio-group column>
                <sp-label slot="label">Lasso Tool:</sp-label>
                <sp-radio value="lf" data-part="LF">Auto Fill</sp-radio>
                <sp-radio value="lc" data-part="LC">Auto Clear</sp-radio>
                <sp-radio value="ll" data-part="LL" checked>Default</sp-radio>
            </sp-radio-group>
        </WC>
        </>
    );
}
