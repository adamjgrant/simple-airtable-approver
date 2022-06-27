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
    },
    {
      "branch": "literals-goodjob"
    },
    {
      "branch": "literals-nicelydone"
    },
    { "branch": "literals-congratulations" },
    { "branch": "literals-waytogo" }
  ],
"literals-waytogo": { "ps": "(Awesome! You did a great job!|Good job! You are great!|Nice job! You are very good!|You did great! Thank you!|Thank you for doing a great job!|You are amazing! Thank you so much!|You are amazing!)" },
  "literals-congratulations": { "ps": "(That is really great news!|Wow, congratulations!|That's amazing news!|What great news!|That's fabulous news!|Congratulations!)" },
"literals-nicelydone": { "ps": "(Wow, that's amazing!|You did a fantastic job!|Your work is splendid!|What an amazing job!|You did such a great job!|That's really terrific work!|A great job, as always!|Impressive work!)" },
  "literals-goodjob": { "ps": "(Congratulations on your success, keep it up!|Keep up the great work!|Good job, keep up the good work!|Keep up the great work!)" },
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