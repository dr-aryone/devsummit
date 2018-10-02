
var request = require('request');
var fs = require('fs');
const parse = require('csv-parse/lib/sync')
const assert = require('assert')
const md5 = require('md5');
var path = require('path');
 
const inputSessionsFilePath = "./sessions.tsv";
const inputSpeakersFilePath = "./speakers.tsv";
const outputFilePath = "./schedule.json";

// if (process.argv.length <= 2) {
//     console.log("Usage: .tsv file");
//     process.exit(-1);
// }
// var filename = process.argv[2];

const sessionsText = fs.readFileSync(inputSessionsFilePath, "utf8");
const speakersText = fs.readFileSync(inputSpeakersFilePath, "utf8");

const sessions = parse(sessionsText, {
    columns: true,
    skip_empty_lines: true,
    delimiter: '\t'
})

const speakers = parse(speakersText, {
    columns: true,
    skip_empty_lines: true,
    delimiter: '\t'
})

var output = {};
output.sessions = {};
output.speakers = {};

var dinoCounter = 0;
const dinoMap = [
    'dino-blue.png',
    'dino-green.png',
    'dino-yellow.png',
    'dino-red.png'
]

for(var i in speakers) {
    let speaker = speakers[i];
    let speakerId = md5(speaker.ldap);
    
    let profilePath = path.join('static/images/speakers', speaker.ldap + '.jpg');

    if (fs.existsSync(profilePath)) {
        console.log(profilePath, 'exists');
        let newPath = path.join('static/images/speakers', speakerId + '.jpg');

        fs.renameSync(profilePath, newPath);

    } else {
        console.log(profilePath, 'nope');
    }

    speaker.ldap = speakerId;

    output.speakers[speakerId] = speaker;
    output.speakers[speakerId].dino = dinoMap[dinoCounter];
    dinoCounter++;

    if (dinoCounter == 4) {
        dinoCounter = 0;
    }
}

//console.log(output.speakers);

for(var i in sessions) {
    let session = sessions[i];

    let sessionSpeakers = [];
    if (session.internal_speakers) {
        sessionSpeakers = session.internal_speakers.split(',');
    }
    
    output.sessions[session.key] = {
        "day_index": session.day_index,
        "name": session.name,
        "theme": session.theme,
        "time_label": session.time_label,
        "when": session.when,
//        "description": session.description,
        "speakers": []
    }

    for(var i in sessionSpeakers) {
        let speakerLdap = sessionSpeakers[i];
        let speakerId = md5(speakerLdap);
        output.sessions[session.key].speakers.push(
            output.speakers[speakerId]
        )
    }
}

console.log(output);
fs.writeFileSync(outputFilePath, JSON.stringify(output, null, 4));
