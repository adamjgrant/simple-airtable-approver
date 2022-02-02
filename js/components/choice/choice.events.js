let choice_permutations = {};

import { lol } from '../../permutations/lol.js'
choice_permutations.lol = lol;

import { agreed } from '../../permutations/agreed.js';
choice_permutations.agreed = agreed;

import { nice } from '../../permutations/nice.js';
choice_permutations.nice = nice;

import { oh } from '../../permutations/oh.js';
choice_permutations.oh = oh;

import { sorry } from '../../permutations/sorry.js';
choice_permutations.sorry = sorry;

import { facepalm } from '../../permutations/facepalm.js';
choice_permutations.facepalm = facepalm;

import { wtf } from '../../permutations/wtf.js';
choice_permutations.wtf = wtf;

import { yes } from '../../permutations/yes.js';
choice_permutations.yes = yes;

import { no } from '../../permutations/no.js';
choice_permutations.no = no;

m.choice.events(_$ => {
    _$("nav ul a.choice-row").forEach(a => {
        a.addEventListener("click", () => {
            const choice_name = a.dataset.choice;
            const permutations = choice_permutations[choice_name];
            _$.act.permute({ json: permutations });
        });
    });
})