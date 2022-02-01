export const wtf = {
    "main": [
        { "branch": "sometimes-lol-first", "then": { "branch": "wtfing" } }
    ],
    "wtfing": [
        { "branch": "wtf", "then": { "branch": "emojis-sometimes" } },
        { "branch": "wth", "then": { "branch": "emojis-sometimes" } },
        { "branch": "what-on-earth", "then": { "branch": "emojis-sometimes" } }
    ],
    "wth": [
        { "ps": "(wth|WTH|W...T...H|w in the h|w the h)(...|?|???)" }
    ],
    "wtf": [
        { "ps": "(wtf|WTF|W...T...F|w in the f|w the f)(...|?|???)" }
    ],
    "what-on-earth": [
        { "ps": "what (on earth|the hell|the heck|the f---)(?|??|???)" }
    ],
    "emojis": { "ps": "(😳|🤦‍♂️|🤨|😶|😧|🙃)" },
    "emojis-sometimes": [
        [""],
        [""],
        [""],
        [" ", { "branch": "emojis" }]
    ],
    "sometimes-lol-first": [
        [""],
        [""],
        [""],
        [{ "ps": "(lol|LOL)(.|...|) " }]
    ]
}