export const facepalm = {
    "main": [{
        "branch": "emojis",
        "then": [{
                "branch": "smh",
                "then": {
                    "branch": "emojis"
                }
            },
            {
                "branch": "facepalm",
                "then": {
                    "branch": "emojis"
                }
            },
            {
                "branch": "for-real",
                "then": {
                    "branch": "emojis"
                }
            }
        ]
    }],
    "smh": [{
        "ps": "(smh|smdh|#smh|#smdh) "
    }],
    "facepalm": [{
        "ps": "(facepalm|#facepalm) "
    }],
    "for-real": [
        "For real?",
        "For real???",
        "Are you serious?",
        "You gotta be kidding me",
        "No way.",
        "Unbelieveable",
        "You can't make this stuff up.",
        "You can't make this up.", [
            [
                ""
            ],
            [
                " ", [{
                        "branch": "smh"
                    },
                    {
                        "branch": "facepalm"
                    }
                ]
            ]
        ]
    ],
    "emojis": [
        [
            "",
            "",
            ""
        ],
        {
            "ps": "(🤦|🙈|😑|🤦‍♂️|🙁)"
        }
    ]
}