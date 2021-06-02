// Russian sounds and characters
RU_NOT_VOWELS = ['к', 'п', 'с', 'т', 'ф', 'х', 'ц', 'ч', 'ш', 'щ','б', 'в', 'г', 'д', 'ж', 'з','л', 'м', 'н', 'р','й', 'ь', 'ъ'];
RU_VOWELS = ['а', 'е', 'и', 'у', 'о', 'ё', 'э', 'ю', 'я', 'ы'];
RU_LETTERS = RU_NOT_VOWELS + RU_VOWELS;

SENTENCE_SPLITERS = ['!', '?', '.'];
PUNCTUATION_MARKS = [',', ';', ':', '(', ')', '"', '-', '—', '"', '{', '}', '<', '>', '\''] + SENTENCE_SPLITERS;
SPACES = [' ', '\t'];

COMPLEX_SYL_FACTOR = 4;

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

function countParameters (text)
{
    text = text.toLowerCase()
    let numberOfSentences = countSentences(text);
    let numberOfChars = text.length;
    let numberOfSpaces = text.length - text.replaceAll(' ', '').length;
    let numberOfParagraphs = (text.match(new RegExp("\n", "g")) || []).length;
    let numberOfWords = 0;       
    let numberOfLetters = 0;      
    let numberOfSyllabes = 0;         
    let numberOfComplexWords = 0; 
    let numberOfSimpleWords = 0;
    let textWithoutPuctuationMarks = text;
    for (let i = 0; i < PUNCTUATION_MARKS.length; i ++)
    {
        textWithoutPuctuationMarks = textWithoutPuctuationMarks.replaceAll(PUNCTUATION_MARKS[i], ' ');
    }
    let words = textWithoutPuctuationMarks.split(' ');
    words = words.filter(element => element !== "");
    numberOfWords = words.length;
    for (let i = 0; i < words.length; i ++)
    {
        let w = words[i];
        let has_syl = false;
        let wsyl = 0;
        for (let j = 0; j < w.length; j ++)
        {
            let ch = w[j];
            if (RU_LETTERS.indexOf(ch) != -1)
            {
                numberOfLetters ++;
                if (RU_VOWELS.indexOf(ch) != -1)
                {
                    numberOfSyllabes ++;
                    has_syl = true;
                    wsyl ++;
                }
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
    if (numberOfChars < 1){ document.getElementById("error").textContent = "Слишком мало символов в тексте."; return false;}
    if (numberOfLetters < 1 || numberOfLetters*2 < numberOfChars){ document.getElementById("error").textContent = "Слишком мало русских букв в тексте."; return false;}
    if (numberOfSyllabes < 1){ document.getElementById("error").textContent = "Слишком мало слов в тексте."; return false;}
    if (numberOfWords < 1){ document.getElementById("error").textContent = "Слишком мало слов в тексте."; return false;}
    if (numberOfSentences < 1){ document.getElementById("error").textContent = "Слишком мало предложений в тексте."; return false;}
    
    document.getElementById("SMOG_rus").textContent               =calculateSMOG_rus(numberOfComplexWords, numberOfSentences);
    document.getElementById("FleschKincaidLevel_rus").textContent =calculateFleschKincaidGradeLevel_rus(numberOfSentences, numberOfWords, numberOfSyllabes);
    document.getElementById("ColemanLiau_rus").textContent        =calculateColemanLiau_rus(numberOfSentences, numberOfWords, numberOfLetters);
    document.getElementById("DaleChall_rus").textContent          =calculateDaleChall_rus(numberOfComplexWords, numberOfWords, numberOfSentences);
    document.getElementById("ARI_rus").textContent                =calculateARI_rus(numberOfLetters, numberOfWords, numberOfSentences);
    document.getElementById("GunningFog").textContent             =calculateGunningFog_rus(numberOfWords, numberOfComplexWords, numberOfSentences);
  
   let grade = calculateGrade(calculateSMOG_rus(numberOfComplexWords, numberOfSentences),
                               calculateFleschKincaidGradeLevel_rus(numberOfSentences, numberOfWords, numberOfSyllabes),
                               calculateColemanLiau_rus(numberOfSentences, numberOfWords, numberOfLetters),
                               calculateDaleChall_rus(numberOfComplexWords, numberOfWords, numberOfSentences),
                               calculateARI_rus(numberOfLetters, numberOfWords, numberOfSentences),
                               calculateGunningFog_rus(numberOfWords, numberOfComplexWords, numberOfSentences));
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

function calculateSMOG_rus(numberOfComplexWords, numberOfSentences)
{
    let n = 0.92 * Math.sqrt((41.1 / numberOfSentences) * numberOfComplexWords) + 4.0;
    return n.toFixed(2);
}

function calculateFleschKincaidGradeLevel_rus(numberOfSentences, numberOfWords, numberOfSyllabes)
{
    let n = 0.53 * (numberOfWords / numberOfSentences) + 4.56 * (numberOfSyllabes / numberOfWords) - 6.3;
    return n.toFixed(2);
}

function calculateColemanLiau_rus(numberOfSentences, numberOfWords, numberOfLetters)
{
    let l = numberOfLetters / numberOfWords * 100;
    let s = numberOfSentences / numberOfWords * 100;
    let n =  0.03 * l - 0.48 * s - 5.09;
    return n.toFixed(2);
}

function calculateDaleChall_rus(numberOfComplexWords, numberOfWords, numberOfSentences)
{
    let n = 0.08 * (numberOfComplexWords / numberOfWords * 100) + 0.17 * (numberOfWords / numberOfSentences);
    return n.toFixed(2);
}

function calculateARI_rus(numberOfLetters, numberOfWords, numberOfSentences)
{
    let n = 2.59 * numberOfLetters / numberOfWords + 0.79 * numberOfWords / numberOfSentences - 18.04;
    return n.toFixed(2);
}

function calculateGunningFog_rus(numberOfWords, numberOfComplexWords, numberOfSentences)
{
    let n = 0.8 * numberOfWords / numberOfSentences + 21.3 * numberOfComplexWords / numberOfWords;
    return n.toFixed(2);
}

function calculateGrade(smog, fkgl, cl, dc, ari, gf)
{
    smog = 0.1 * smog + 0.4;
    fkgl = 0.1 * fkgl + 0.6;
    cl   = 0.1 * cl   + 1;
    dc   = 0.4 * dc + 0.2;
    ari  = 0.1 * ari  + 1.1;
    gf   = 0.1 * gf   + 0.3;
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
        return "Очень легко читать";
    }
    if (grade < 2)
    {
        bar.style.backgroundColor = '#85CB33';
        bar.style.width = '75%';
        return "Легко читать";
    }
    if (grade < 3)
    {
        bar.style.backgroundColor = '#F1D302';
        bar.style.width = '50%';
        return "Довольно легко читать";
    }
    bar.style.backgroundColor = '#C1292E';
    bar.style.width = '30%';
    return "Сложно читать";

}

function getTime(numberOfMinutes)
{
    let minutes = Math.trunc(numberOfMinutes);
    let seconds = Math.round((numberOfMinutes - minutes) * 60);
    res = minutes.toFixed() + " минут";
    if (minutes % 10 == 1)
    {
        res += "а";
    }
    if (minutes % 10 > 1 && minutes % 10 < 5)
    {
        res += "ы";
    }
    if (seconds > 0)
    {
        res += " " + seconds.toFixed() + " секунд";
    }
    if (seconds % 10 == 1)
    {
        res += "а";
    }
    if ((seconds % 10 > 1) && (seconds % 10 < 5))
    {
        res += "ы";
    }
    return res;
}

function toggle(value)
{
    if (value == "ru")
    {
        document.location.replace("readability_en.html");
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
        handleFile(file);
    });
    dropArea.addEventListener('click', function(){
        if (document.getElementById('textArea').value == "")
        {
            input.click();
            input.addEventListener('change', function(){
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
        document.getElementById("error").textContent = "Можно загружать только текстовые файлы";
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