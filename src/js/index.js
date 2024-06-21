function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

const haks = ['H01', 'H02', 'H03', 'H04', 'H05', 'H06', 'H07', 'H08', 'H09', 'H10', 'H11', 'H12', 'H13', 'H14', 'H15', 'H16', 'H17', 'H18', 'H19', 'H20', 'H21', 'H22', 'H23', 'H24', 'H25', 'H26', 'H27', 'H28', 'H29', 'H30']; 

const chongs = ['C01', 'C02', 'C03', 'C04', 'C05', 'C06', 'C07', 'C08'];
const luis = ['L01', 'L02', 'L03', 'L04', 'L05', 'L06', 'L07', 'L08', 'L09', 'L11', 'L12', 'L13', 'L14', 'L15', 'L16'];
const paks = ['P01', 'P02', 'P03', 'P04', 'P05', 'P06', 'P07', 'P08',  'P09', 'P10'];
const alls = [].concat(haks, paks, luis, chongs).sort(() => Math.random() - 0.5);
const pics = {haks, luis, paks, chongs};
const act = ['H02', 'H04', 'H07', 'H13', 'H24', 'H30', 'L02', 'L03', 'L04', 'L06', 'L11', 'L13', 'L14','P01','P02'];
const acts = [].concat(act).sort(() => Math.random() - 0.5);
const prods = [
  'r01',  'r02',  'r03',  'r04',  'r05',
  'r06',  'r07',  'r08',  'r09',  'r10',
  'r11', 'r12', 'r13', 'r14', 'r15',
  'r16', 'r17', 'r18', 'r19', 'r20',
  'r21', 'r22', 'r23', 'r24', 'r25',
  'r26', 'r27', 'r28', 'r29', 'r30'
]

function loadContent(url) {
  return {
    loadedContent: null,
    async mounted(url) {
      const response = await fetch(url);
      const content = await response.text();
      this.loadedContent = content;
    }
  };
}

function playAudio(image) {
  const audioElement = document.querySelector(`[x-ref=audio][src="src/aud/${image}.mp3"]`);
  if (audioElement) {
    audioElement.play();
  }
}


const authors = ['李敏莉']










function searchAndScroll() {
  var searchKeyword = document.getElementById('searchInput').value;
  var found = window.find(searchKeyword, false, false, true, false, false, false);

  if (found) {
    window.scrollTo(0, window.scrollY - 100);
    document.getElementById('prevResult').style.display = 'inline';
    document.getElementById('nextResult').style.display = 'inline';
  } else {
    // 处理没有找到匹配文本的情况
  }
}

// function navigateToPreviousResult() {
//   var searchKeyword = document.getElementById('searchInput').value;
//   var found = window.find(searchKeyword, false, false, true, false, false, true);

//   if (found) {
//     window.scrollTo(0, window.scrollY - 100);
//   }
// }

// function navigateToNextResult() {
//   var searchKeyword = document.getElementById('searchInput').value;
//   var found = window.find(searchKeyword, false, false, true, false, false, false);

//   if (found) {
//     window.scrollTo(0, window.scrollY - 100);
//   }
// }

// function searchAndScroll() {
//   var searchKeyword = document.getElementById('searchInput').value;

//   if (searchKeyword) {
//     var elements = document.querySelectorAll(":contains('" + searchKeyword + "')");

//     if (elements.length > 0) {
//       elements.forEach(function(element) {
//         var rect = element.getBoundingClientRect();

//         window.scrollTo({
//           top: rect.top + window.pageYOffset,
//           behavior: 'smooth'
//         });
//       });
//     } else {
//       alert('未找到匹配的文本');
//     }
//   } else {
//     alert('请输入搜索关键字');
//   }
// }
