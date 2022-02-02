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
        "ps": "(Totally|Absolutely|Yes indeed|For sure|100%)"
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