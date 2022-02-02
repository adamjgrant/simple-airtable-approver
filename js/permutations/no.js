export const no = {
    "main": [{
        "branch": "just-no",
        "then": [
            ". ",
            {
                "branch": "sometimes-extra",
                "then": [
                    { "branch": "sometimes-emojis" }
                ]
            }
        ]
    }],
    "just-no": [{
        "ps": "(No|Nope|Nah|Nooo|Not really|I don't think so|I think no|I wouldn't say so)"
    }],
    "extra": [{
        "ps": "(Not really|I wouldn't say so|Not exactly|Not at all|Gonna go with no|I'm pretty sure no|I don't believe so)"
    }],
    "emojis": [
        { "ps": "(👎|✋|🙅🏻‍♂️|⛔️)" }
    ],
    "sometimes-emojis": [
        [],
        [],
        [],
        [
            { "branch": "emojis" }
        ]
    ],
    "sometimes-extra": [
        [
            ""
        ],
        [
            ""
        ],
        [
            ""
        ],
        [{
            "branch": "extra"
        }]
    ]
}