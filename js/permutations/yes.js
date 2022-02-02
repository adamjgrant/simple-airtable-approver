export const yes = {
    "main": [{
        "branch": "just-yes",
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
    "just-yes": [{
        "ps": "(Yes|Yep|Oh yeah|Yeah)"
    }],
    "extra": [{
        "ps": "(Totally|Absolutely|Yes indeed|For sure|100%|I believe so|Pretty sure|I think so|I'd say so|I'm pretty sure)"
    }],
    "emojis": [
        { "ps": "(👍|👏|🙆🏻‍♂️|❤️|💯)" }
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