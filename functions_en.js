// English sounds and characters
EN_NOT_VOWELS = ['b', 'c', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm','n', 'p', 'q', 'r', 's', 't','v', 'w', 'x', 'z'];
EN_VOWELS = ['a', 'e', 'i', 'o', 'u', 'y'];
EN_LETTERS = EN_NOT_VOWELS + EN_VOWELS;

SENTENCE_SPLITERS = ['!', '?', '.'];
PUNCTUATION_MARKS = [',', ';', ':', '(', ')', '"', '-', '—', '"', '{', '}', '<', '>', '\''] + SENTENCE_SPLITERS;
SPACES = [' ', '\t'];

COMPLEX_SYL_FACTOR = 3;

AVERAGE_SPEAKING = 125;
AVERAGE_READING = 225;

function countSentences (text) 
{
    for (let i = 0; i < SENTENCE_SPLITERS.length; i ++)
    {
        text = text.replaceAll (SENTENCE_SPLITERS[i], '.')
    }
    let cntSentences = text.length - text.replaceAll('.', '').length;
    return cntSentences;
}

function countSyllabes(word) {
    word = word.toLowerCase();                                   
    if(word.length <= 3) { return 1; }                          
      word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, ''); 
      word = word.replace(/^y/, ''); 
      if (word.match(/[aeiouy]{1,2}/g)) 
      {                               
        return word.match(/[aeiouy]{1,2}/g).length;
      }
      else
      {
        return 0;
      }                
  }

function countParameters (text)
{
    if (text.length == 0){ document.getElementById("error").textContent = "Too few characters in the text."; return false;}
    
    text = text.toLowerCase()
    let numberOfSentences = countSentences(text);
    let numberOfChars = text.length;   
    text = text.replace(/\n+/g,'\n');
    let numberOfParagraphs = (text.match(new RegExp("\n", "g")) || []).length;
    text = text.replace(/\s+/g,' ');
    let numberOfSpaces = text.length - text.replaceAll(' ', '').length;
    let numberOfWords = 0;       
    let numberOfLetters = 0;      
    let numberOfSyllabes = 0;         
    let numberOfComplexWords = 0; 
    let numberOfSimpleWords = 0;
    let textWithoutPuctuationMarks = text;
    for (let i = 0; i < PUNCTUATION_MARKS.length; i ++)
    {
        textWithoutPuctuationMarks = textWithoutPuctuationMarks.replaceAll(PUNCTUATION_MARKS[i], '');
    }
    let words = textWithoutPuctuationMarks.split(' ');
    words = words.filter(element => element !== "");
    numberOfWords = words.length;
    for (let i = 0; i < words.length; i ++)
    {
        let w = words[i];
        if (w){
            wsyl = countSyllabes(w);
        }
        else{
            wsyl=0;
        }
        numberOfSyllabes += wsyl;
        for (let j = 0; j < w.length; j ++)
        {
            let ch = w[j];
            if (EN_LETTERS.indexOf(ch) != -1)
            {
                numberOfLetters ++;
            }
        }
        if (wsyl > COMPLEX_SYL_FACTOR)
        {
            numberOfComplexWords ++;
        }
        else
        {
            numberOfSimpleWords ++;
        }
    }
    if (numberOfChars < 1){ document.getElementById("error").textContent = "Too few characters in the text."; return false;}
    if (numberOfLetters < 1 || numberOfLetters*2 < numberOfChars){ document.getElementById("error").textContent = "Too few english characters in the text."; return false;}
    if (numberOfSyllabes < 1){ document.getElementById("error").textContent = "Too few words in the text."; return false;}
    if (numberOfWords < 1){ document.getElementById("error").textContent = "Too few words in the text."; return false;}
    if (numberOfSentences < 1){ document.getElementById("error").textContent = "Too few sentences in the text."; return false;}
    
    document.getElementById("SMOG").textContent               =calculateSMOG(numberOfComplexWords, numberOfSentences);
    document.getElementById("FleschKincaidLevel").textContent =calculateFleschKincaidGradeLevel(numberOfSentences, numberOfWords, numberOfSyllabes);
    document.getElementById("ColemanLiau").textContent        =calculateColemanLiau(numberOfSentences, numberOfWords, numberOfLetters);
    document.getElementById("DaleChall").textContent          =calculateDaleChall(numberOfComplexWords, numberOfWords, numberOfSentences);
    document.getElementById("ARI").textContent                =calculateARI(numberOfLetters, numberOfWords, numberOfSentences);
    document.getElementById("GunningFog").textContent         =calculateGunningFog(numberOfWords, numberOfComplexWords, numberOfSentences);

    let grade = calculateGrade(calculateSMOG(numberOfComplexWords, numberOfSentences),
                               calculateFleschKincaidGradeLevel(numberOfSentences, numberOfWords, numberOfSyllabes),
                               calculateColemanLiau(numberOfSentences, numberOfWords, numberOfLetters),
                               calculateDaleChall(numberOfComplexWords, numberOfWords, numberOfSentences),
                               calculateARI(numberOfLetters, numberOfWords, numberOfSentences),
                               calculateGunningFog(numberOfWords, numberOfComplexWords, numberOfSentences));
    document.getElementById("all_indices").textContent            = category(grade);

    document.getElementById("numberOfSentences").textContent      =numberOfSentences;
    document.getElementById("numberOfChars").textContent          =numberOfChars;
    document.getElementById("numberOfSpaces").textContent         =numberOfSpaces;
    document.getElementById("numberOfLetters").textContent        =numberOfLetters;
    document.getElementById("numberOfSyllabes").textContent       =numberOfSyllabes;
    document.getElementById("numberOfWords").textContent          =numberOfWords;
    //document.getElementById("numberOfComplexWords").textContent   =numberOfComplexWords;
    //document.getElementById("numberOfSimpleWords").textContent    =numberOfSimpleWords;
    document.getElementById("numberOfParagraphs").textContent     =numberOfParagraphs;
    document.getElementById("averageWordsInSentence").textContent =(numberOfWords / numberOfSentences).toFixed(2);
    document.getElementById("averageLettersInWord").textContent   =(numberOfLetters / numberOfWords).toFixed(2);
    document.getElementById("averageSyllabesInWord").textContent  =(numberOfSyllabes / numberOfWords).toFixed(2);
    // document.getElementById("complexWords").textContent           =numberOfComplexWords / numberOfWords * 100;
    document.getElementById("readingTime").textContent            = getTime(numberOfWords / AVERAGE_READING);
    document.getElementById("speakingTime").textContent           = getTime(numberOfWords / AVERAGE_SPEAKING);
    return true;
}
function calculateSMOG(numberOfComplexWords, numberOfSentences)
{
    // Метрика SMOG https://en.wikipedia.org/wiki/SMOG
    let n = 1.043 * Math.sqrt(numberOfComplexWords * 30 / numberOfSentences) + 3.1291;
    return n.toFixed(2);
}

function calculateFleschKincaid(numberOfSentences, numberOfWords, numberOfSyllabes)
{
    // Метрика Flesch–Kincaid https://en.wikipedia.org/wiki/Flesch–Kincaid_readability_tests
    return 206.835 - 1.015 * (numberOfWords / numberOfSentences) - 84.6 * (numberOfSyllabes / numberOfWords); 
}

function calculateFleschKincaidGradeLevel(numberOfSentences, numberOfWords, numberOfSyllabes)
{
    let n = 0.39 * (numberOfWords / numberOfSentences) + 11.8 * (numberOfSyllabes / numberOfWords) - 15.59;
    return n.toFixed(2);
}

function calculateColemanLiau(numberOfSentences, numberOfWords, numberOfLetters)
{
    // Метрика Coleman–Liau https://en.wikipedia.org/wiki/Coleman–Liau_index
    let l = numberOfLetters / numberOfWords * 100;
    let s = numberOfSentences / numberOfWords * 100;
    let n = 0.0588 * l - 0.296 * s - 15.8;
    return n.toFixed(2);
}

function calculateDaleChall(numberOfComplexWords, numberOfWords, numberOfSentences)
{
    // Метрика Dale–Chall https://en.wikipedia.org/wiki/Dale–Chall_readability_formula
    let n = 0.1579 * (numberOfComplexWords / numberOfWords * 100) + 0.0496 * (numberOfWords / numberOfSentences);
    return n.toFixed(2);
}

function calculateARI(numberOfLetters, numberOfWords, numberOfSentences)
{
    let n = 4.71 * numberOfLetters / numberOfWords + 0.5* numberOfWords / numberOfSentences - 21.43;
    return n.toFixed(2);
}

function calculateGunningFog(numberOfWords, numberOfComplexWords, numberOfSentences)
{
    let n = 0.4 * (numberOfWords / numberOfSentences) + 100 * (numberOfComplexWords / numberOfWords);
    return n.toFixed(2);
}

function calculateGrade(smog, fkgl, cl, dc, ari, gf)
{
    smog = 0.2 * smog - 1;
    fkgl = 0.1 * fkgl + 0.6;
    cl   = 0.1 * cl   + 1;
    dc   = 0.4 * dc;
    ari  = 0.1 * ari  + 1;
    gf   = 0.1 * gf   + 0.2;
    let grade = (smog + fkgl + cl + dc + ari + gf) / 6;
    return grade; 
}

function category(grade)
{
    const bar = document.querySelectorAll('.progress-value')[0];
    var value = document.getElementById("progress-value");
    console.log(value);
    if (grade < 1)
    {
        bar.style.backgroundColor = '#6BD425';
        bar.style.width = '90%';
        return "Very easy to read";
    }
    if (grade < 2)
    {
        bar.style.backgroundColor = '#85CB33';
        bar.style.width = '75%';
        return "Easy to read";
    }
    if (grade < 3)
    {
        bar.style.backgroundColor = '#F1D302';
        bar.style.width = '50%';
        return "Quite easy to read";
    }
    bar.style.backgroundColor = '#C1292E';
    bar.style.width = '30%';
    return "Hard to read";

}

function getTime(numberOfMinutes)
{
    let minutes = Math.trunc(numberOfMinutes);
    let seconds = Math.round((numberOfMinutes - minutes) * 60);
    res = minutes.toFixed() + " minute";
    if (minutes > 1)
    {
        res += "s";
    }
    if (seconds > 0)
    {
        res += " " + seconds.toFixed() + " second";
    }
    if (seconds > 1)
    {
        res += "s";
    }
    return res;
}

function toggle(value)
{
    if (value == "en")
    {
        document.location.replace("readability_rus.html");
        return;
    }
}

function initFileLoader()
{
    let input = document.getElementById("files");
    let dropArea = document.getElementById("text");

    document.addEventListener('dragover', ev => ev.preventDefault());
    document.addEventListener('drop', ev => ev.preventDefault());

    dropArea.addEventListener('drop', function(event) {
        event.preventDefault();
        console.log(event.dataTransfer);
        let file = event.dataTransfer.files[0];
        console.log(file);
        handleFile(file);
    });
    
    dropArea.addEventListener('click', function(){
        if (document.getElementById('textArea').value == "")
        {
            input.click();
            input.addEventListener('change', function(){
                console.log(input.files);
                let file = input.files[0];
                handleFile(file);
            });
        }
    });
}

function handleFile(file)
{
    let type = file.type.replace(/\/.+/, '');
    if (type == "text"){
        createText(file);
    }
    else {
        document.getElementById("error").textContent = "Only text files are accepted";
    }
}

function createText(file)
{
    let reader = new FileReader();
    reader.readAsText(file, 'utf-8');
    
    reader.onload = () => {
        document.getElementById("textArea").value = reader.result;
        document.getElementById("clearBtn").style.display='inline-block';
        document.getElementById('error').style.display='none';
    }
}
