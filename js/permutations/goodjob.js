// https://permy.link/45gpxsdljw
export const goodjob = {
    "main": [
      {
        "branch": "prefixes",
        "then": {
          "branch": "middle", "then": {
            "branch": "suffixes"
          }
        }
      }
    ],
    "middle": [
      {
        "branch": "goodjob"
      },
      {
        "branch": "nicelydone"
      },
      {
        "branch": "waytogo"
      },
      {
        "branch": "congratulations"
      }
    ],
    "goodjob": [
      "Good",
      "Nice",
      "Awesome",
      "Killer",
      [
        " ",
        [
          "job",
          [
            "!",
            "!!",
            "!!!",
            ""
          ]
        ]
      ]
    ],
    "nicelydone": [
      "Nicely", "Very well", [
        " ", [
          "done", [
            "!", "!!", [" "]
          ]
        ]
      ]
    ],
    "waytogo": [
      "Way to go", "Awesome", [
        "!", "!!", [" ", { "branch": "extras" }]
      ]
    ],
    "congratulations": [
      "Congratulations", "Congrats", [
        "!", "!!", "! 🍾", "! 🥂", "! 🎉", [" ", 
                    { "branch": "extras" }
                   ]
      ]
    ],
    "prefixes": [
      "Wow! ",
      "Holy moley! ",
      "",
      "",
      "Oh wow! ",
      ""
    ],
    "suffixes": [
      { "ps": "(😳|😱|🤩|🤯|😮|💯|💥|👍|😎||||)" }
    ],
    "extras": [
      "Nicely done", "Very nice", "Good work", "", "", "", "That is really something", "You did it", ["!"]
    ]
  }