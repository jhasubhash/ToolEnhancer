
const batchPlay = require("photoshop").action.batchPlay;

export const FillCommand = async () => {
    const result = await batchPlay(
    [
    {
        _obj: "fill",
        using: {
            _enum: "fillContents",
            _value: "foregroundColor"
        },
        opacity: {
            _unit: "percentUnit",
            _value: 100
        },
        mode: {
            _enum: "blendMode",
            _value: "normal"
        },
        _options: {
            dialogOptions: "dontDisplay"
        }
    }
    ],{
    synchronousExecution: false,
    modalBehavior: "fail"
    });
}

export const DiselectCommand = async () => {
    const result = await batchPlay(
        [
           {
              _obj: "set",
              _target: [
                 {
                    _ref: "channel",
                    _property: "selection"
                 }
              ],
              to: {
                 _enum: "ordinal",
                 _value: "none"
              },
              _options: {
                 dialogOptions: "dontDisplay"
              }
           }
        ],{
           synchronousExecution: false,
           modalBehavior: "fail"
        });
}