export const sorry = {
    "main": [
        { "branch": "im-sorry" },
        { "branch": "that-sucks" },
        { "branch": "sorry-to-hear-that" }
    ],
    "im-sorry": [
        "Oh ", "Oh...", "", [
            "I'm sorry", "I'm so sorry", [
                ".", { "branch": "emojis" }
            ]
        ]
    ],
    "that-sucks": [
        "Shoot ", "Shoot...", "", "Man, ", "Man...", [
            "That sucks", "That sucks...", "That really sucks", [
                ["."],
                [
                    ". ", [{ "branch": "sorry-to-hear-that", "then": { "branch": "emojis" } }]
                ]
            ]
        ]
    ],
    "sorry-to-hear-that": [
        "I'm ", [
            "so", "really", "very", [
                " ", [
                    "sorry", [
                        " ", [
                            "to hear that", "about that", {
                                "branch": "emojis"
                            }
                        ]
                    ]
                ]
            ]
        ]
    ],
    "emojis": [
        { "ps": "(😔|☹️|😕|🙁|😟)" }
    ]
}