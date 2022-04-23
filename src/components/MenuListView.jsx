import React, {useEffect, useRef, useState, useCallback} from "react";
import { WC } from "./WC.jsx";
import { FillCommand, DiselectCommand } from "./Command.jsx";

const action = require('photoshop').action;
let autoLassoEnabled = false;
let lastActionLasso = false;

export const MenuListView = () => {
    const lassoFillRef = useRef(null);
    const [autoLassoFill, setAutoLassoFill] = useState(false);
     
    useEffect(() => {
        autoLassoEnabled = autoLassoFill;
    }, [autoLassoFill])
     

    const onMenuItemChange = (evt) => {
        const target = evt.target;
        const part = target.getAttribute("data-part");
        console.log(evt.target);
        switch (part) {
            case "LF":
                setAutoLassoFill(target.checked);
                break;
            default:
                break;
        }
    }

    const fillAndDiselect = async () => {
        await FillCommand();
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
            if(autoLassoEnabled){
                fillAndDiselect();
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
            <div>
            <sp-checkbox ref={lassoFillRef} data-part="LF">Lasso Auto Fill</sp-checkbox>
            </div>
        </WC>
        </>
    );
}
