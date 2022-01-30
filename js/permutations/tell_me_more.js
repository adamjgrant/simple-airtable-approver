export const tell_me_more = {
    "main": [
        { "branch": "thats-interesting" },
        { "branch": "what-do-you-mean" }
    ],
    "thats-interesting": [
        "That's", "This is", "That is", [
            " ", [
                "actually ", "", [
                    "really ", "", [
                        "interesting ", [
                            { "ps": "what('s|is) (all that about|the story there)?" }
                        ]
                    ]
                ]
            ]
        ]
    ],
    "what-do-you-mean": [
        "Interesting", [
            "...", ". ", ". If you don't mind me asking, ", ". If I may ask: ", [
                { "ps": "what  (is all that about|do you mean by that|is that about)( exactly|)?" }
            ]
        ]
    ]
}