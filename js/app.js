
  "use strict";

  if(window.pdfjsLib){
    try{ window.pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js"; }catch(e){}
  }

  var LYNN_LOGO_SVG = '<svg role="img" aria-label="Lynn" viewBox="0 0 248.27 117.91" fill="currentColor" xmlns="http://www.w3.org/2000/svg"> <path d="M 52.0273 75.3555 L 15.0508 75.3555 L 15.0508 0.0000 L 0.0000 0.0000 L 0.0000 89.3164 L 56.7656 89.3164 Z M 52.0273 75.3555"/> <path d="M 163.7891 28.4062 C 154.1797 28.4062 145.7422 32.8086 140.8672 36.4531 L 140.8672 28.1211 L 126.7656 28.1211 L 126.7656 89.3164 L 140.8672 89.3164 L 140.8672 39.5859 L 164.2500 39.5859 C 164.5586 39.5938 165.7109 39.7227 165.7109 41.2773 L 165.7109 89.3164 L 179.8945 89.3164 L 179.8945 41.3047 C 179.8945 32.8008 174.3086 28.4062 163.7891 28.4062"/> <path d="M 232.1602 28.4062 C 222.5508 28.4062 214.1211 32.8086 209.2461 36.4531 L 209.2461 28.1211 L 195.1445 28.1211 L 195.1445 89.3164 L 209.2461 89.3164 L 209.2461 39.5859 L 232.6289 39.5859 C 232.9336 39.5938 234.0859 39.7227 234.0859 41.2773 L 234.0859 89.3164 L 248.2656 89.3164 L 248.2656 41.3047 C 248.2656 32.8008 242.6875 28.4062 232.1602 28.4062"/> <path d="M 101.9727 28.1211 L 83.2227 83.3555 L 64.4609 28.1211 L 49.3555 28.1211 L 70.1289 89.3164 L 81.1992 89.3164 L 71.4922 117.9141 L 86.6016 117.9141 L 117.0781 28.1211 Z M 101.9727 28.1211"/> </svg>';

  /* ============ static taxonomy ============ */
  var CATEGORY_TREE = {
    "공통가설": ["01. 가설건물","02. 환경관리비","03. 가시설물","04. 가설설비","05. 장비비","06. 기타공통가설공사"],
    "건축": ["01. 가설공사","02. 파일공사","03. 철근콘크리트공사","04. 조적공사","05. 방수공사","06. 미장공사","07. 타일공사","08. 석공사","09. 내장공사","10. 창호공사","11. 유리공사","12. 도장공사","13. 수장공사","14. 금속공사","15. 잡공사","16. 가구공사","17. 인테리어공사","18. 특화공사"],
    "현장관리비": ["01. 급여","02. 복리후생비","03. 여비교통비","04. 통신비","05. 집기비품","06. 도서인쇄비","07. 수도광열비","08. 예비비","09. 수선비","10. 세금과공과","11. 지급수수료","12. 판매관리비","13. TFT 운영비용"]
  };
  var MAJORS = ["공통가설","건축","현장관리비"];
  var MAJOR_COLOR = { "공통가설":"#4a5fd1", "건축":"#0f8f7e", "현장관리비":"#9350ae" };
  // guideline_docs 문서 id는 영문/숫자만 허용되는 저장소가 있어 대공종명을 그대로 쓰지 않고 매핑한다.
  var MAJOR_ID = { "공통가설":"common", "건축":"arch", "현장관리비":"sitecost" };

  var DEPARTMENTS = ["건축예산팀","건축기획팀","품질기술팀","설계팀","상품기획팀","인테리어팀","외주관리팀","자재구매팀","스마트기술팀","안전보건실","경영지원팀"];
  var DEFAULT_DEPARTMENT = "건축예산팀";

  var ACCEPT_EXT = {
    ".pdf":"application/pdf", ".png":"image/png", ".jpg":"image/jpeg", ".jpeg":"image/jpeg",
    ".gif":"image/gif", ".webp":"image/webp", ".svg":"image/svg+xml",
    ".csv":"text/csv", ".txt":"text/plain", ".md":"text/markdown", ".json":"application/json",
    ".xlsx":"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ".xls":"application/vnd.ms-excel",
    ".eml":"message/rfc822"
  };
  var EXCEL_EXT = { ".xlsx":1, ".xls":1 };
  var EXCEL_MIMES = {
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":1,
    "application/vnd.ms-excel":1
  };
  function isExcelMime(ct){ return !!EXCEL_MIMES[ct||""]; }

  /* ============ state ============ */
  var S = {
    sb:null, session:null,
    viewerId:null, isOwner:false, isPartLeader:false, isTeamMember:false, canManageRoster:false, viewApproved:false, membersReady:false,
    ready:false,
    changes:[], members:{}, sites:[],
    filters:{ major:null, minor:null, status:"approved", q:"", urgency:null, department:null },
    collapsedMajors:{},
    formExecItems:[], formAttachments:[], formDraft:null,
    attachItemId:null, attachIndex:0,
    lastListHash:"#/",
    formEditId:undefined,
    deleteConfirmId:null,
    sidebarW:196, docsearchW:340,
    siteDetailId:null, siteViewMode:"checklist", siteDraft:null,
    showWelcome:false,
    unsubs:[],
    guidelineDocs:{}, guidelineChunksByDoc:{}, guidelineRevisions:{}, gdocUploading:{}, gdocPending:{}, pdfCache:{},
    docsearchOpen:false, docsearchQuery:"", docsearchResults:[], docsearchViewer:null
  };

  (function loadPanelWidths(){
    try{
      var sw = localStorage.getItem("lynn_sidebarW"); if(sw) S.sidebarW = Math.max(150, Math.min(420, parseInt(sw,10)||196));
      var dw = localStorage.getItem("lynn_docsearchW"); if(dw) S.docsearchW = Math.max(260, Math.min(1400, parseInt(dw,10)||340));
      var dso = localStorage.getItem("lynn_docsearchOpen"); if(dso==="1") S.docsearchOpen = true;
    }catch(e){}
  })();

  function esc(s){
    s = (s==null) ? "" : String(s);
    return s.replace(/[&<>"']/g, function(c){
      return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c];
    });
  }
  function nowIso(){ return new Date().toISOString(); }
  function parseNum(v){
    if(v==null || v==="") return NaN;
    var n = Number(String(v).replace(/,/g,"").trim());
    return n;
  }
  function fmtNum(v){
    var n = parseNum(v);
    if(isNaN(n)) return "";
    return n.toLocaleString("ko-KR");
  }
  function fmtMoney(v){
    var n = parseNum(v);
    if(v==null || v==="" || isNaN(n)) return "-";
    return n.toLocaleString("ko-KR");
  }
  function pad2(n){ return n<10 ? "0"+n : ""+n; }
  function ymOf(d){ return d.getFullYear()+"-"+pad2(d.getMonth()+1); }
  function fmtDate(iso, prec){
    if(!iso) return "미기재";
    var parts = iso.split("-");
    var yy = (parts[0]||"").length===4 ? parts[0].slice(2) : parts[0];
    if(prec === "month") return yy+"."+parts[1];
    return yy+"."+parts[1]+"."+(parts[2]||"01");
  }
  function fmtYm(ym){
    var p = ym.split("-"); return p[0]+"년 "+parseInt(p[1],10)+"월";
  }
  function toast(msg){
    var t = document.getElementById("toast");
    if(!t) return; // #toast 요소가 없으면 그냥 조용히 무시 (여기서 죽으면 호출부의 나머지 로직이 통째로 중단됨)
    t.textContent = msg; t.classList.add("show");
    clearTimeout(t._h);
    t._h = setTimeout(function(){ t.classList.remove("show"); }, 2600);
  }
  function statusLabel(st){ return st==="approved" ? "승인됨" : st==="pending" ? "대기중" : "반려됨"; }
  function statusChip(st){ return '<span class="chip '+st+'">'+statusLabel(st)+'</span>'; }
  function urgencyChip(u){
    if(u==="required") return '<span class="chip urgent-required">필수반영</span>';
    if(u==="confirm") return '<span class="chip urgent-confirm">확인필요</span>';
    return "";
  }
  function canEditChange(c){
    if(!c) return false;
    if(c.status === "pending") return c.submittedById === S.viewerId || S.isPartLeader || S.isOwner;
    // 승인이 끝난 내역도 파트장(또는 총괄)은 계속 수정할 수 있게 한다.
    if(c.status === "approved") return S.isPartLeader || S.isOwner;
    return false;
  }
  function canWrite(){
    return !!(S.isTeamMember || S.isPartLeader || S.isOwner);
  }
  function canDelete(){
    return !!(S.isPartLeader || S.isOwner);
  }
  function copyText(text){
    if(navigator.clipboard && navigator.clipboard.writeText){
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function(resolve, reject){
      try{
        var ta = document.createElement("textarea");
        ta.value = text; ta.style.position = "fixed"; ta.style.left = "-9999px";
        document.body.appendChild(ta); ta.focus(); ta.select();
        var ok = document.execCommand("copy");
        document.body.removeChild(ta);
        ok ? resolve() : reject(new Error("copy failed"));
      }catch(e){ reject(e); }
    });
  }
  function renderPdfInto(container, url, onDone){
    if(!window.pdfjsLib){
      container.innerHTML = '<div class="att-fallback" style="padding:14px;font-size:12px;color:var(--ink-faint);">PDF 미리보기를 사용할 수 없습니다. 아래 링크로 열어주세요.</div>';
      return;
    }
    container.innerHTML = '<div class="att-fallback" style="padding:14px;font-size:12px;color:var(--ink-faint);">PDF 불러오는 중…</div>';
    window.pdfjsLib.getDocument(url).promise.then(function(pdf){
      if(!document.body.contains(container)) return;
      container.innerHTML = "";
      var numPages = pdf.numPages;
      var canvases = [];
      var chain = Promise.resolve();
      var _loop = function(n){
        chain = chain.then(function(){
          if(!document.body.contains(container)) return;
          return pdf.getPage(n).then(function(page){
            var hostWidth = container.clientWidth || 700;
            var baseViewport = page.getViewport({ scale: 1 });
            // 레티나 등 고밀도 화면에서는 캔버스가 화면 픽셀 배율(devicePixelRatio)만큼 더 촘촘하게
            // 그려져야 CSS로 늘렸을 때도 흐려지지 않아요. 배율은 최대 2배까지만 반영해서 캔버스가
            // 너무 커져 메모리를 많이 쓰지 않도록 합니다.
            var fitScale = hostWidth / baseViewport.width;
            var dpr = Math.min(window.devicePixelRatio || 1, 2);
            var scale = Math.min(3.5, fitScale * dpr);
            var viewport = page.getViewport({ scale: scale });
            var canvas = document.createElement("canvas");
            canvas.width = viewport.width; canvas.height = viewport.height;
            container.appendChild(canvas);
            canvases.push(canvas);
            var ctx = canvas.getContext("2d");
            return page.render({ canvasContext: ctx, viewport: viewport }).promise;
          });
        });
      };
      for(var n=1;n<=numPages;n++){ _loop(n); }
      return chain.then(function(){ if(onDone) onDone(canvases); });
    }).catch(function(err){
      console.warn("pdf render failed", err);
      if(document.body.contains(container)){
        container.innerHTML = '<div class="att-fallback" style="padding:14px;font-size:12px;color:var(--ink-faint);">PDF 미리보기를 불러오지 못했습니다. 아래 링크로 열어주세요.</div>';
      }
    });
  }

  /* ============ excel/csv attachment preview ============ */
  function renderTable(container, head, bodyRows){
    if(!head || !head.length){ container.innerHTML = '<div class="att-fallback" style="padding:14px;font-size:12px;color:var(--ink-faint);">표시할 데이터가 없습니다.</div>'; return; }
    var html = '<table><thead><tr>'+head.map(function(h){ return '<th>'+esc(h)+'</th>'; }).join("")+'</tr></thead><tbody>'
      +bodyRows.slice(0,500).map(function(r){ return '<tr>'+head.map(function(_,i){ return '<td>'+esc(r[i]||"")+'</td>'; }).join("")+'</tr>'; }).join("")
    +'</tbody></table>';
    container.innerHTML = html;
  }
  // ExcelJS 기반 셀 서식 읽기 — 무료 SheetJS(xlsx.js) 커뮤니티 에디션은 cellStyles:true를 줘도
  // 셀 채우기색·글꼴 굵기/색은 읽지 못하는 걸로 SheetJS 공식 문서에 명시돼 있어요(그 기능은 유료 Pro 전용).
  // 테두리가 계속 안 보였던 것도 이거랑은 별개로 html2canvas 캡처 위치 문제였는데(위에서 수정), 색상/굵게는
  // 라이브러리 자체의 한계라서 표/그리드 구조를 아무리 바꿔도 절대 나올 수 없었던 거예요.
  // 그래서 실제로 셀 서식을 읽어올 수 있는 무료 오픈소스 라이브러리인 ExcelJS로 교체했습니다.
  function excelColWidthToPx(wch){
    if(wch==null) return 84;
    var px = Math.round(wch*7 + 6);
    return Math.max(36, Math.min(360, px));
  }
  function excelArgbToHex(argb){
    if(!argb) return "";
    var hex = String(argb).slice(-6);
    if(!hex || /^0{6}$/.test(hex)) return "";
    return "#"+hex;
  }
  function excelColLetterToNum(letters){
    var n = 0;
    for(var i=0;i<letters.length;i++){ n = n*26 + (letters.charCodeAt(i) - 64); }
    return n;
  }
  function excelParseAddr(addr){
    var m = /^([A-Z]+)(\d+)$/.exec(String(addr||"").toUpperCase());
    if(!m) return null;
    return { row: parseInt(m[2],10), col: excelColLetterToNum(m[1]) };
  }
  function excelCellBgHex(cell){
    try{
      var fill = cell.fill;
      if(fill && fill.type === "pattern" && fill.pattern === "solid" && fill.fgColor){
        return excelArgbToHex(fill.fgColor.argb);
      }
    }catch(e){}
    return "";
  }
  function excelCellFontHex(cell){
    try{ if(cell.font && cell.font.color) return excelArgbToHex(cell.font.color.argb); }catch(e){}
    return "";
  }
  function excelCellBold(cell){
    try{ return !!(cell.font && cell.font.bold); }catch(e){ return false; }
  }
  function excelCellAlign(cell){
    try{
      var h = cell.alignment && cell.alignment.horizontal;
      if(h === "center" || h === "right" || h === "left") return h;
    }catch(e){}
    try{
      if(window.ExcelJS && (cell.type === ExcelJS.ValueType.Number || cell.type === ExcelJS.ValueType.Date)) return "right";
    }catch(e){}
    return "left";
  }
  function excelBorderSideCss(s){
    if(!s || !s.style) return "1px solid #b9bec5";
    var color = (s.color && excelArgbToHex(s.color.argb)) || "#8a8f96";
    var width = s.style === "thick" ? "2px" : (s.style === "medium" ? "1.4px" : "1px");
    return width+" solid "+color;
  }
  function excelCellBorderCss(cell){
    try{
      var b = cell.border;
      if(!b || (!b.top && !b.right && !b.bottom && !b.left)) return "border:1px solid #b9bec5;";
      return "border-top:"+excelBorderSideCss(b.top)+";border-right:"+excelBorderSideCss(b.right)
        +";border-bottom:"+excelBorderSideCss(b.bottom)+";border-left:"+excelBorderSideCss(b.left)+";";
    }catch(e){ return "border:1px solid #b9bec5;"; }
  }
  function excelFormatMaybeNumber(n){
    if(typeof n !== "number" || isNaN(n)) return String(n);
    return n.toLocaleString("ko-KR", { maximumFractionDigits: 6 });
  }
  function excelCellText(cell){
    var v = cell.value;
    if(v == null || v === "") return "";
    if(v instanceof Date){
      var y=v.getFullYear(), mo=v.getMonth()+1, d=v.getDate();
      return y+"-"+(mo<10?"0"+mo:mo)+"-"+(d<10?"0"+d:d);
    }
    if(typeof v === "object"){
      if(v.richText) return v.richText.map(function(rt){ return rt.text||""; }).join("");
      if(v.result != null) return typeof v.result === "number" ? excelFormatMaybeNumber(v.result) : String(v.result);
      if(v.text != null) return String(v.text);
      if(v.error) return String(v.error);
      return "";
    }
    if(typeof v === "number") return excelFormatMaybeNumber(v);
    return String(v);
  }
  // 워크시트를 병합 셀·정렬·채우기색·글꼴 굵기/색·테두리까지 반영한 CSS 그리드(<div>)로 재구성합니다.
  // 인쇄 영역(페이지 나누기 미리보기에서 흰색으로 표시되는 부분)이 지정돼 있으면 그 범위만 가져옵니다 —
  // 회색(인쇄 영역 밖) 부분에 값이 남아있어도 실제 엑셀에서 인쇄/미리보는 화면과 똑같이 보이도록.
  function excelParsePrintArea(ws){
    try{
      var pa = ws.pageSetup && ws.pageSetup.printArea;
      if(!pa) return null;
      var minR=null, minC=null, maxR=null, maxC=null;
      String(pa).split(",").forEach(function(rng){
        var parts = rng.split(":");
        var s = excelParseAddr(parts[0]), e = excelParseAddr(parts[1]||parts[0]);
        if(!s || !e) return;
        minR = minR==null ? s.row : Math.min(minR, s.row);
        minC = minC==null ? s.col : Math.min(minC, s.col);
        maxR = maxR==null ? e.row : Math.max(maxR, e.row);
        maxC = maxC==null ? e.col : Math.max(maxC, e.col);
      });
      if(minR==null) return null;
      return { rStart:minR, cStart:minC, rEnd:maxR, cEnd:maxC };
    }catch(e){ return null; }
  }
  function buildExcelTable(ws, maxRows, maxCols){
    var printArea = excelParsePrintArea(ws);
    var rStart = 1, cStart = 1, rEnd, cEnd;
    if(printArea){
      rStart = printArea.rStart; cStart = printArea.cStart;
      rEnd = Math.min(printArea.rEnd, rStart + maxRows - 1);
      cEnd = Math.min(printArea.cEnd, cStart + maxCols - 1);
    } else {
      rEnd = Math.min(ws.rowCount || 0, maxRows);
      cEnd = Math.min(ws.columnCount || 0, maxCols);
    }
    if(rEnd < rStart || cEnd < cStart) return null;
    var span = {}, covered = {};
    ((ws.model && ws.model.merges) || []).forEach(function(rangeStr){
      var parts = String(rangeStr).split(":");
      var s = excelParseAddr(parts[0]), e = excelParseAddr(parts[1]||parts[0]);
      if(!s || !e) return;
      if(s.row < rStart || s.col < cStart || s.row > rEnd || s.col > cEnd) return;
      var re = Math.min(e.row, rEnd), ce = Math.min(e.col, cEnd);
      span[s.row+"_"+s.col] = { rowSpan: re-s.row+1, colSpan: ce-s.col+1 };
      for(var r=s.row; r<=re; r++){
        for(var c=s.col; c<=ce; c++){
          if(r===s.row && c===s.col) continue;
          covered[r+"_"+c] = true;
        }
      }
    });
    var colWidths = [];
    for(var c0=cStart;c0<=cEnd;c0++){
      var col = ws.getColumn(c0);
      colWidths.push(excelColWidthToPx(col && col.width));
    }
    var grid = document.createElement("div");
    grid.style.cssText = "display:inline-grid;grid-template-columns:"+colWidths.map(function(w){ return w+"px"; }).join(" ")+";background:#ffffff;font-family:'Noto Sans KR','Malgun Gothic',sans-serif;font-size:12px;color:#1f2733;";
    for(var r=rStart;r<=rEnd;r++){
      var row = ws.getRow(r);
      for(var c=cStart;c<=cEnd;c++){
        if(covered[r+"_"+c]) continue;
        var cell = row.getCell(c);
        var spanInfo = span[r+"_"+c];
        var rowSpan = spanInfo ? spanInfo.rowSpan : 1;
        var colSpan = spanInfo ? spanInfo.colSpan : 1;
        var bg = excelCellBgHex(cell);
        var fg = excelCellFontHex(cell);
        var align = excelCellAlign(cell);
        var justify = align === "right" ? "flex-end" : (align === "center" ? "center" : "flex-start");
        var cellEl = document.createElement("div");
        cellEl.style.cssText = excelCellBorderCss(cell)
          +"padding:4px 7px;white-space:pre-wrap;word-break:break-word;overflow:hidden;"
          +"display:flex;align-items:center;justify-content:"+justify+";text-align:"+align+";box-sizing:border-box;"
          +(excelCellBold(cell) ? "font-weight:700;" : "")
          +"background:"+(bg || "#ffffff")+";"
          +(fg ? "color:"+fg+";" : "");
        cellEl.style.gridRow = (r-rStart+1)+" / span "+rowSpan;
        cellEl.style.gridColumn = (c-cStart+1)+" / span "+colSpan;
        cellEl.textContent = excelCellText(cell);
        grid.appendChild(cellEl);
      }
    }
    return grid;
  }
  // 화면 밖에서 표를 렌더링한 뒤 이미지로 캡처해서 보여줍니다 — 실제 셀 병합/정렬이 그대로 보이고, 브라우저별 표 렌더링 차이도 없어요.
  function renderTableAsImage(container, table, note){
    if(!window.html2canvas){
      container.innerHTML = "";
      container.appendChild(table);
      return;
    }
    // position:fixed + 화면 밖 매우 큰 음수 left(-99999px)는 html2canvas가 요소 위치/스크롤 계산을
    // 잘못해서 스타일 없이(테두리·배경색 누락) 캡처되는 경우가 있어요. z-index로 뒤로 숨기는 방식으로 변경.
    var wrap = document.createElement("div");
    wrap.style.cssText = "position:fixed;top:0;left:0;z-index:-99999;background:#ffffff;";
    wrap.appendChild(table);
    document.body.appendChild(wrap);
    // 강제 리플로우 후 다음 프레임에서 캡처 — 동적으로 만든 표/그리드 스타일이 완전히 반영된 뒤 찍어야
    // html2canvas가 테두리·배경색을 놓치지 않습니다.
    void table.offsetHeight;
    requestAnimationFrame(function(){
      html2canvas(table, { scale:2, backgroundColor:"#ffffff", scrollX:0, scrollY:0, useCORS:true }).then(function(canvas){
        if(wrap.parentNode) wrap.parentNode.removeChild(wrap);
        if(!document.body.contains(container)) return;
        var img = document.createElement("img");
        img.src = canvas.toDataURL("image/png");
        img.alt = note || "첨부 표 미리보기";
        img.style.cssText = "display:block;width:"+(canvas.width/2)+"px;height:auto;max-width:none;";
        container.innerHTML = "";
        container.appendChild(img);
      }).catch(function(err){
        console.warn("table capture failed", err);
        if(wrap.parentNode) wrap.parentNode.removeChild(wrap);
        if(document.body.contains(container)){
          container.innerHTML = "";
          container.appendChild(table);
        }
      });
    });
  }
  function renderExcelInto(container, url){
    container.innerHTML = '<div class="att-fallback" style="padding:14px;font-size:12px;color:var(--ink-faint);">표 불러오는 중…</div>';
    if(!window.ExcelJS){ container.innerHTML = '<div class="att-fallback" style="padding:14px;font-size:12px;color:var(--ink-faint);">Excel 미리보기 기능을 불러오지 못했습니다. 아래 링크로 열어주세요.</div>'; return; }
    fetch(url).then(function(res){ return res.arrayBuffer(); }).then(function(buf){
      if(!document.body.contains(container)) return;
      var wb = new ExcelJS.Workbook();
      return wb.xlsx.load(buf).then(function(){
        var ws = wb.worksheets[0];
        if(!ws) throw new Error("no sheet");
        var table = buildExcelTable(ws, 300, 40);
        if(!table){ container.innerHTML = '<div class="att-fallback" style="padding:14px;font-size:12px;color:var(--ink-faint);">표시할 데이터가 없습니다.</div>'; return; }
        renderTableAsImage(container, table, "엑셀 첨부 미리보기");
      });
    }).catch(function(err){
      console.warn("excel preview failed", err);
      if(document.body.contains(container)){
        container.innerHTML = '<div class="att-fallback" style="padding:14px;font-size:12px;color:var(--ink-faint);">표를 불러오지 못했습니다. 아래 링크로 열어주세요.</div>';
      }
    });
  }
  function renderCsvInto(container, url){
    container.innerHTML = '<div class="att-fallback" style="padding:14px;font-size:12px;color:var(--ink-faint);">표 불러오는 중…</div>';
    fetch(url).then(function(res){ return res.text(); }).then(function(text){
      if(!document.body.contains(container)) return;
      var rows = parseCsv(text);
      renderTable(container, rows[0], rows.slice(1));
    }).catch(function(err){
      console.warn("csv preview failed", err);
      if(document.body.contains(container)){
        container.innerHTML = '<div class="att-fallback" style="padding:14px;font-size:12px;color:var(--ink-faint);">표를 불러오지 못했습니다. 아래 링크로 열어주세요.</div>';
      }
    });
  }
  function parseCsv(text){
    var rows = []; var row = []; var field = ""; var inQuotes = false;
    for(var i=0;i<text.length;i++){
      var ch = text[i];
      if(inQuotes){
        if(ch === '"'){
          if(text[i+1] === '"'){ field += '"'; i++; } else { inQuotes = false; }
        } else field += ch;
      } else {
        if(ch === '"') inQuotes = true;
        else if(ch === ","){ row.push(field); field = ""; }
        else if(ch === "\n"){ row.push(field); rows.push(row); row = []; field = ""; }
        else if(ch === "\r"){ /* skip */ }
        else field += ch;
      }
    }
    if(field.length || row.length){ row.push(field); rows.push(row); }
    return rows.filter(function(r){ return r.length>1 || (r[0]||"").trim()!==""; });
  }

  /* ============ .eml(이메일 원본) 첨부파일 미리보기 ============
     완전한 RFC822/MIME 파서는 아니고, 제목/보낸사람/받는사람/날짜와 본문 텍스트를 최대한
     뽑아서 보여주는 수준의 가벼운 파서다. 본문은 항상 텍스트로만 렌더링해서(innerHTML로
     원본 HTML을 그대로 넣지 않음) 첨부된 이메일 안에 스크립트가 있어도 실행되지 않는다. */
  function decodeBytesToText(binStr, charset){
    var bytes = new Uint8Array(binStr.length);
    for(var i=0;i<binStr.length;i++) bytes[i] = binStr.charCodeAt(i) & 0xFF;
    var cs = (charset||"utf-8").trim().toLowerCase().replace(/^"|"$/g,"");
    try{ return new TextDecoder(cs).decode(bytes); }
    catch(e){
      try{ return new TextDecoder("utf-8").decode(bytes); }
      catch(e2){ return binStr; }
    }
  }
  function decodeQuotedPrintable(str){
    return str.replace(/=\r\n/g,"").replace(/=\n/g,"").replace(/=([0-9A-Fa-f]{2})/g, function(_, hex){ return String.fromCharCode(parseInt(hex,16)); });
  }
  // 이메일 헤더(제목/보낸사람 등)에 한글이 섞여 있으면 RFC 2047 "=?charset?B/Q?...?=" 형식으로
  // 인코딩돼 있는 경우가 대부분이라, 이 인코딩을 풀어서 실제 한글 텍스트로 보여준다.
  function decodeMimeWords(str){
    if(!str) return "";
    return str.replace(/=\?([^?]+)\?([BbQq])\?([^?]*)\?=/g, function(_, charset, enc, data){
      try{
        if(enc.toUpperCase()==="B") return decodeBytesToText(atob(data.replace(/\s+/g,"")), charset);
        var qp = data.replace(/_/g," ").replace(/=([0-9A-Fa-f]{2})/g, function(__, hex){ return String.fromCharCode(parseInt(hex,16)); });
        return decodeBytesToText(qp, charset);
      }catch(e){ return data; }
    });
  }
  function parseEmlHeaders(raw){
    var unfolded = raw.replace(/\r\n/g,"\n").replace(/\n[ \t]+/g," ");
    var headers = {};
    unfolded.split("\n").forEach(function(line){
      var m = line.match(/^([^:\s][^:]*):\s*(.*)$/);
      if(m){
        var key = m[1].trim().toLowerCase();
        if(!(key in headers)) headers[key] = m[2];
      }
    });
    return headers;
  }
  function parseEmlContentType(ctHeader){
    if(!ctHeader) return { type:"text/plain", params:{} };
    var segs = ctHeader.split(";");
    var type = segs[0].trim().toLowerCase();
    var params = {};
    for(var i=1;i<segs.length;i++){
      var eq = segs[i].indexOf("=");
      if(eq===-1) continue;
      var k = segs[i].slice(0,eq).trim().toLowerCase();
      var v = segs[i].slice(eq+1).trim().replace(/^"|"$/g,"");
      params[k] = v;
    }
    return { type: type, params: params };
  }
  function splitEmlHeaderBody(raw){
    var m = raw.match(/\r?\n\r?\n/);
    if(!m) return { headers: raw, body: "" };
    var idx = raw.search(/\r?\n\r?\n/);
    return { headers: raw.slice(0, idx), body: raw.slice(idx + m[0].length) };
  }
  function decodeEmlBodyPart(body, headers){
    var cte = (headers["content-transfer-encoding"]||"").trim().toLowerCase();
    var ct = parseEmlContentType(headers["content-type"]);
    var charset = ct.params.charset || "utf-8";
    var text;
    if(cte === "base64") text = decodeBytesToText(atob(body.replace(/[\r\n\s]+/g,"")), charset);
    else if(cte === "quoted-printable") text = decodeBytesToText(decodeQuotedPrintable(body), charset);
    else text = body;
    return { text: text, type: ct.type };
  }
  function emlHtmlToText(html){
    html = html.replace(/<script[\s\S]*?<\/script>/gi,"").replace(/<style[\s\S]*?<\/style>/gi,"");
    html = html.replace(/<br\s*\/?>/gi,"\n").replace(/<\/(p|div|tr|li|h[1-6])>/gi,"\n");
    // 문서에 붙이지 않은 요소라 스크립트는 절대 실행되지 않고, HTML 엔티티(&amp; 등)만 텍스트로 풀린다.
    var tmp = document.createElement("div");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  }
  function parseEmlFile(raw){
    var top = splitEmlHeaderBody(raw);
    var headers = parseEmlHeaders(top.headers);
    var attachmentNames = [];
    var bodyText = "", isHtml = false;
    function walk(bodyRaw, hdrs, depth){
      var ct = parseEmlContentType(hdrs["content-type"]);
      if(ct.type.indexOf("multipart/")===0 && ct.params.boundary && depth < 4){
        bodyRaw.split("--"+ct.params.boundary).forEach(function(partRaw){
          var trimmed = partRaw.replace(/^\r?\n/,"");
          if(!trimmed || trimmed.indexOf("--")===0) return;
          var pieces = splitEmlHeaderBody(trimmed);
          if(pieces.headers.indexOf(":")===-1) return; // 경계 앞뒤 잡음(전문/후문) 걸러내기
          var partHeaders = parseEmlHeaders(pieces.headers);
          var disp = (partHeaders["content-disposition"]||"").toLowerCase();
          var partCt = parseEmlContentType(partHeaders["content-type"]);
          var isAttachment = disp.indexOf("attachment")!==-1
            || (partCt.type.indexOf("text/")!==0 && partCt.type.indexOf("multipart/")!==0);
          if(isAttachment){
            var fnMatch = (partHeaders["content-disposition"]||"").match(/filename\*?="?([^";]+)"?/i);
            var fn = partCt.params.name || (fnMatch && fnMatch[1]) || "첨부파일";
            attachmentNames.push(decodeMimeWords(fn));
            return;
          }
          walk(pieces.body, partHeaders, depth+1);
        });
      } else {
        var decoded = decodeEmlBodyPart(bodyRaw, hdrs);
        if(decoded.type === "text/html"){
          if(!bodyText || isHtml){ bodyText = decoded.text; isHtml = true; }
        } else {
          if(!bodyText || isHtml){ bodyText = decoded.text; isHtml = false; }
        }
      }
    }
    walk(top.body, headers, 0);
    if(isHtml) bodyText = emlHtmlToText(bodyText);
    return {
      subject: decodeMimeWords(headers["subject"]) || "(제목 없음)",
      from: decodeMimeWords(headers["from"]||""),
      to: decodeMimeWords(headers["to"]||""),
      date: headers["date"]||"",
      bodyText: bodyText.trim(),
      attachmentNames: attachmentNames
    };
  }
  function renderEmlInto(container, url){
    container.innerHTML = '<div class="att-fallback" style="padding:14px;font-size:12px;color:var(--ink-faint);">이메일 불러오는 중…</div>';
    fetch(url).then(function(res){ return res.text(); }).then(function(raw){
      if(!document.body.contains(container)) return;
      var eml;
      try{ eml = parseEmlFile(raw); }catch(e){ console.warn("eml parse failed", e); eml = null; }
      if(!eml){
        container.innerHTML = '<div class="att-fallback" style="padding:14px;font-size:12px;color:var(--ink-faint);">이메일 미리보기를 표시할 수 없습니다. 아래 링크로 열어주세요.</div>';
        return;
      }
      var attNote = eml.attachmentNames.length
        ? '<div class="att-eml-note">첨부파일 '+eml.attachmentNames.length+'개 포함 (원본 파일에서 확인해주세요): '+eml.attachmentNames.map(esc).join(", ")+'</div>'
        : "";
      container.innerHTML = '<div class="att-eml">'
        +'<div class="att-eml-head">'
          +'<div class="att-eml-subject">'+esc(eml.subject)+'</div>'
          +(eml.from ? '<div class="att-eml-meta"><b>보낸사람</b> '+esc(eml.from)+'</div>' : "")
          +(eml.to ? '<div class="att-eml-meta"><b>받는사람</b> '+esc(eml.to)+'</div>' : "")
          +(eml.date ? '<div class="att-eml-meta"><b>날짜</b> '+esc(eml.date)+'</div>' : "")
        +'</div>'
        +attNote
        +'<div class="att-eml-body">'+esc(eml.bodyText || "(본문 없음)")+'</div>'
      +'</div>';
    }).catch(function(err){
      console.warn("eml preview failed", err);
      if(document.body.contains(container)){
        container.innerHTML = '<div class="att-fallback" style="padding:14px;font-size:12px;color:var(--ink-faint);">이메일을 불러오지 못했습니다. 아래 링크로 열어주세요.</div>';
      }
    });
  }

  /* ============ zoom controls (카드 첨부자료 / 지침서 미리보기 공통) ============
     예전에는 마우스를 올리면 돋보기 렌즈가 따라다니는 방식이었는데, 대신 각 뷰어마다
     +/- 버튼으로 배율을 조절하거나, 뷰어 위에서 Ctrl(또는 Cmd)+휠로 확대/축소할 수 있게 한다. */
  function zoomWidgetHtml(prefix){
    return '<div class="zoom-controls">'
      +'<button type="button" class="zoom-btn" id="'+prefix+'ZoomOut" aria-label="축소">−</button>'
      +'<span class="zoom-pct mono" id="'+prefix+'ZoomPct">100%</span>'
      +'<button type="button" class="zoom-btn" id="'+prefix+'ZoomIn" aria-label="확대">+</button>'
    +'</div>';
  }
  // 지침서 검색처럼 페이지를 넘겨도(prev/next 등으로 render()가 다시 호출돼도) 사용자가 맞춰둔
  // 배율이 풀리지 않아야 하는 뷰어를 위한 저장소. prefix별로 마지막 배율을 기억해뒀다가
  // persist=true로 호출될 때 그 값을 이어서 쓴다.
  var ZOOM_LEVELS = {};
  function wireZoomWidget(prefix, scrollEl, targetEl, persist){
    if(!scrollEl || !targetEl) return;
    var min = 0.5, max = 3, step = 0.2;
    var zoom = (persist && ZOOM_LEVELS[prefix]) ? ZOOM_LEVELS[prefix] : 1;
    var pctEl = document.getElementById(prefix+"ZoomPct");
    function apply(){
      targetEl.style.transform = "scale("+zoom.toFixed(2)+")";
      targetEl.style.transformOrigin = "top left";
      if(pctEl) pctEl.textContent = Math.round(zoom*100)+"%";
    }
    function setZoom(z){
      zoom = Math.max(min, Math.min(max, z));
      if(persist) ZOOM_LEVELS[prefix] = zoom;
      apply();
    }
    var inBtn = document.getElementById(prefix+"ZoomIn");
    var outBtn = document.getElementById(prefix+"ZoomOut");
    if(inBtn) inBtn.addEventListener("click", function(){ setZoom(zoom+step); });
    if(outBtn) outBtn.addEventListener("click", function(){ setZoom(zoom-step); });
    scrollEl.addEventListener("wheel", function(e){
      if(!e.ctrlKey && !e.metaKey) return;
      e.preventDefault();
      setZoom(zoom + (e.deltaY > 0 ? -0.1 : 0.1));
    }, { passive:false });
    apply();
  }
  /* ============ Supabase data adapter (Firestore-like surface) ============
     Reproduces the small slice of the Firestore client API this app relies on
     (.doc(path).update/delete, .collection(name).add/orderBy/limit/onSnapshot),
     backed by real Supabase tables, with camelCase(JS) <-> snake_case(Postgres)
     field mapping handled per collection so the rest of app.js needs no changes. */

  var COLLECTION_TABLE = { changes: "changes", sites: "sites", members: "profiles", guidelineDocs: "guideline_docs", guidelineChunks: "guideline_chunks", guidelineRevisions: "guideline_revisions" };

  var FIELD_MAP = {
    changes: {
      major:"major", minor:"minor", title:"title", summary:"summary", department:"department",
      changeDate:"change_date", effectiveDate:"effective_date", effectiveScope:"effective_scope",
      reason:"reason", urgency:"urgency", status:"status", tags:"tags",
      execItems:"exec_items", attachments:"attachments",
      submittedById:"submitted_by", submittedByName:"submitted_by_name", submittedAt:"submitted_at",
      approvedById:"approved_by", approvedByName:"approved_by_name", approvedAt:"approved_at",
      editedById:"edited_by", editedByName:"edited_by_name", editedAt:"edited_at",
      rejectReason:"reject_reason", createdAt:"created_at"
    },
    sites: {
      name:"name", deadline:"deadline", checklistStatus:"checklist_status", appliedMap:"applied_map",
      appliedGuidelines:"applied_guidelines",
      managerId:"manager_id", managerName:"manager_name",
      submittedById:"submitted_by", submittedByName:"submitted_by_name", submittedAt:"submitted_at",
      approvedById:"approved_by", approvedByName:"approved_by_name", approvedAt:"approved_at",
      reopenedById:"reopened_by", reopenedByName:"reopened_by_name", reopenedAt:"reopened_at",
      cancelledById:"cancelled_by", cancelledByName:"cancelled_by_name", cancelledAt:"cancelled_at",
      updatedById:"updated_by", updatedByName:"updated_by_name", updatedAt:"updated_at",
      createdAt:"created_at"
    },
    members: {
      name:"name", displayName:"display_name", role:"role", isAdmin:"is_admin", viewApproved:"view_approved",
      firstSeenAt:"first_seen_at", lastSeenAt:"last_seen_at",
      addedBy:"added_by", addedAt:"added_at", createdAt:"created_at"
    },
    guidelineDocs: {
      major:"major", fileName:"file_name", url:"url", pageCount:"page_count", chunkCount:"chunk_count",
      uploadedById:"uploaded_by", uploadedByName:"uploaded_by_name", uploadedAt:"uploaded_at",
      updatedAt:"updated_at"
    },
    guidelineChunks: {
      docId:"doc_id", chunkIndex:"chunk_index", pages:"pages", updatedAt:"updated_at"
    },
    guidelineRevisions: {
      docId:"doc_id", major:"major", fileName:"file_name", url:"url", pageCount:"page_count",
      uploadedById:"uploaded_by", uploadedByName:"uploaded_by_name", uploadedAt:"uploaded_at", createdAt:"created_at"
    }
  };

  function reverseMap(m){
    var r = {};
    Object.keys(m).forEach(function(k){ r[m[k]] = k; });
    return r;
  }
  var FIELD_MAP_REV = { changes: reverseMap(FIELD_MAP.changes), sites: reverseMap(FIELD_MAP.sites), members: reverseMap(FIELD_MAP.members), guidelineDocs: reverseMap(FIELD_MAP.guidelineDocs), guidelineChunks: reverseMap(FIELD_MAP.guidelineChunks), guidelineRevisions: reverseMap(FIELD_MAP.guidelineRevisions) };

  function toRow(coll, obj){
    var map = FIELD_MAP[coll] || {};
    var row = {};
    Object.keys(obj||{}).forEach(function(k){
      var col = map[k] || k;
      row[col] = obj[k];
    });
    return row;
  }

  function fromRow(coll, row){
    if(!row) return null;
    var map = FIELD_MAP_REV[coll] || {};
    var out = {};
    Object.keys(row).forEach(function(k){
      if(k === "id") return;
      var key = map[k] || k;
      out[key] = row[k];
    });
    return out;
  }

  // 실시간 구독(postgres_changes)이 늦게 도착하거나(네트워크 지연) 실패하는 경우에도, 방금 성공한
  // 내 수정이 화면에 바로 반영되도록 로컬 상태(S.changes/S.sites/S.members)를 즉시 패치해준다.
  // (실시간이 나중에 도착하면 서버 값으로 다시 한번 덮어써질 뿐이라 안전하다.)
  function applyOptimisticPatch(coll, id, data){
    if(coll === "changes"){
      var c = S.changes.find(function(x){ return x.id===id; });
      if(c) Object.assign(c, data);
    } else if(coll === "sites"){
      var s = S.sites.find(function(x){ return x.id===id; });
      if(s) Object.assign(s, data);
    } else if(coll === "members"){
      if(S.members[id]) Object.assign(S.members[id], data);
    }
    render();
  }
  // add()로 새로 만든 문서도 마찬가지로, 실시간 구독이 따라오기 전에 곧바로 해당 상세 페이지로
  // 이동하면(예: 현장 추가 → 바로 그 현장 상세로 이동) 로컬 배열에 아직 없어서 "찾을 수 없습니다"가
  // 뜨는 문제가 있었다 — 새로 만든 항목도 로컬 상태에 즉시 추가해준다.
  function applyOptimisticInsert(coll, id, data){
    var obj = Object.assign({ id: id }, data);
    if(coll === "changes"){
      if(!S.changes.find(function(x){ return x.id===id; })) S.changes.push(obj);
    } else if(coll === "sites"){
      if(!S.sites.find(function(x){ return x.id===id; })) S.sites.push(obj);
    } else if(coll === "members"){
      if(!S.members[id]) S.members[id] = obj;
    }
  }

  function makeDb(sb){
    function docRef(path){
      var parts = path.split("/");
      var coll = parts[0], id = parts[1];
      var table = COLLECTION_TABLE[coll] || coll;
      return {
        update: function(data){
          // .select("id")를 붙여서 실제로 몇 행이 바뀌었는지 응답으로 받아온다. 이게 없으면
          // RLS 정책(using절)에 걸려 행이 0개 매칭돼도 PostgREST는 200(성공)을 돌려주기 때문에,
          // 화면에는 "저장되었습니다" 토스트가 뜨는데 실제로는 아무것도 안 바뀌는 조용한 실패가 생긴다
          // (예: 현장 담당자를 골라도 저장 후 목록에 갔다 오면 다시 "미지정"으로 보이는 증상).
          return sb.from(table).update(toRow(coll, data)).eq("id", id).select("id").then(function(res){
            if(res.error) throw res.error;
            if(!res.data || !res.data.length){
              throw { message:"이 항목을 수정할 권한이 없거나 대상을 찾을 수 없습니다.", code:"NO_ROWS_UPDATED" };
            }
            applyOptimisticPatch(coll, id, data);
            return res;
          });
        },
        set: function(data){
          var row = toRow(coll, data); row.id = id;
          return sb.from(table).upsert(row).then(function(res){
            if(res.error) throw res.error;
            return res;
          });
        },
        delete: function(){
          return sb.from(table).delete().eq("id", id).then(function(res){
            if(res.error) throw res.error;
            return res;
          });
        },
        get: function(){
          return sb.from(table).select("*").eq("id", id).maybeSingle().then(function(res){
            if(res.error) throw res.error;
            var data = res.data;
            return { exists: !!data, id: id, data: function(){ return fromRow(coll, data); } };
          });
        }
      };
    }

    function collectionRef(coll){
      var table = COLLECTION_TABLE[coll] || coll;
      var order = null;
      var lim = null;
      var api = {
        orderBy: function(field, dir){
          var map = FIELD_MAP[coll] || {};
          order = { column: map[field] || field, ascending: dir !== "desc" };
          return api;
        },
        limit: function(n){
          lim = n;
          return api;
        },
        add: function(data){
          return sb.from(table).insert(toRow(coll, data)).select().single().then(function(res){
            if(res.error) throw res.error;
            applyOptimisticInsert(coll, res.data.id, data);
            return { id: res.data.id };
          });
        },
        onSnapshot: function(onNext, onError){
          var cancelled = false;
          function fetchAndEmit(){
            var q = sb.from(table).select("*");
            if(order) q = q.order(order.column, { ascending: order.ascending });
            if(lim) q = q.limit(lim);
            q.then(function(res){
              if(cancelled) return;
              if(res.error){ if(onError) onError(res.error); return; }
              var docs = (res.data||[]).map(function(row){
                return { id: row.id, data: function(){ return fromRow(coll, row); } };
              });
              onNext({ docs: docs });
            }).catch(function(err){ if(!cancelled && onError) onError(err); });
          }
          fetchAndEmit();
          var channel = sb.channel(coll + "_changes_" + Math.random().toString(36).slice(2))
            .on("postgres_changes", { event: "*", schema: "public", table: table }, function(){
              if(!cancelled) fetchAndEmit();
            })
            .subscribe();
          return function unsubscribe(){
            cancelled = true;
            try{ sb.removeChannel(channel); }catch(e){}
          };
        }
      };
      return api;
    }

    return {
      doc: docRef,
      collection: collectionRef
    };
  }

  /* ============ boot / auth (Supabase) ============ */
  function boot(){
    render();
    window.addEventListener("hashchange", render);
    initAuth();
  }

  function initAuth(){
    if(!window.supabase || !window.LYNN_CONFIG || !window.LYNN_CONFIG.url || window.LYNN_CONFIG.url.indexOf("YOUR-PROJECT")!==-1){
      S.ready = true; S.noHost = true; render();
      return;
    }
    S.sb = window.supabase.createClient(window.LYNN_CONFIG.url, window.LYNN_CONFIG.anonKey);
    S.db = makeDb(S.sb);

    S.sb.auth.getSession().then(function(res){
      S.session = (res.data && res.data.session) || null;
      onAuthReady();
    });
    S.sb.auth.onAuthStateChange(function(event, session){
      if(event === "SIGNED_OUT"){
        teardownSubscriptions();
        S.session = null; S.viewerId = null; S.viewerName = null;
        S.isPartLeader=false; S.isTeamMember=false; S.canManageRoster=false; S.isOwner=false; S.viewApproved=false; S.membersReady=false;
        S.changes=[]; S.members={}; S.sites=[]; S.guidelineDocs={}; S.guidelineRevisions={};
        render();
        return;
      }
      var wasSignedIn = !!S.session;
      S.session = session;
      if(session && !wasSignedIn){ onAuthReady(); }
    });
  }

  function onAuthReady(){
    if(!S.session){ S.ready = true; render(); return; }
    var u = S.session.user;
    S.viewerId = u.id;
    S.viewerName = (u.user_metadata && u.user_metadata.name) || (u.email||"").split("@")[0];
    subscribeChanges();
    subscribeMembers();
    subscribeSites();
    subscribeGuidelineDocs();
    subscribeGuidelineChunks();
    subscribeGuidelineRevisions();
    touchLastSeen();
    S.ready = true;
    render();
  }

  function teardownSubscriptions(){
    S.unsubs.forEach(function(fn){ try{ fn(); }catch(e){} });
    S.unsubs = [];
  }

  function touchLastSeen(){
    if(!S.db || !S.viewerId) return;
    S.db.doc("members/"+S.viewerId).update({ lastSeenAt: nowIso() }).catch(function(){});
  }

  function subscribeChanges(){
    var unsub = S.db.collection("changes").orderBy("changeDate","desc").limit(1000).onSnapshot(function(snap){
      S.changes = snap.docs.map(function(d){ return Object.assign({}, d.data()||{}, {id:d.id}); });
      render();
    }, function(err){ console.warn("changes sub error", err); S.subError = true; render(); });
    S.unsubs.push(unsub);
  }
  function subscribeMembers(){
    var unsub = S.db.collection("members").limit(200).onSnapshot(function(snap){
      var m = {};
      snap.docs.forEach(function(d){ m[d.id] = d.data()||{}; });
      S.members = m;
      S.isPartLeader = !!(m[S.viewerId] && m[S.viewerId].role === "파트장");
      S.isTeamMember = !!(m[S.viewerId] && m[S.viewerId].role === "팀원");
      S.isOwner = !!(m[S.viewerId] && m[S.viewerId].isAdmin);
      S.canManageRoster = S.isOwner || S.isPartLeader;
      // 모든 기준이 대외비라 조회자는 팀원/파트장의 승인(view_approved)을 받아야 내용을 볼 수 있다.
      // 팀원·파트장·관리자는 역할 자체로 항상 조회 가능.
      S.viewApproved = !!(m[S.viewerId] && (S.isPartLeader || S.isTeamMember || S.isOwner || m[S.viewerId].viewApproved));
      S.membersReady = true;
      render();
    }, function(err){ console.warn("members sub error", err); });
    S.unsubs.push(unsub);
  }
  function subscribeSites(){
    var unsub = S.db.collection("sites").limit(500).onSnapshot(function(snap){
      S.sites = snap.docs.map(function(d){ return Object.assign({}, d.data()||{}, {id:d.id}); });
      render();
    }, function(err){ console.warn("sites sub error", err); });
    S.unsubs.push(unsub);
  }
  function subscribeGuidelineDocs(){
    var unsub = S.db.collection("guidelineDocs").limit(10).onSnapshot(function(snap){
      var m = {};
      snap.docs.forEach(function(d){
        var data = d.data()||{};
        m[data.major || d.id] = Object.assign({}, data, {id:d.id});
      });
      S.guidelineDocs = m;
      render();
    }, function(err){ console.warn("guidelineDocs sub error", err); });
    S.unsubs.push(unsub);
  }
  function subscribeGuidelineChunks(){
    var unsub = S.db.collection("guidelineChunks").limit(60).onSnapshot(function(snap){
      var byDoc = {};
      snap.docs.forEach(function(d){
        var data = d.data()||{};
        var arr = byDoc[data.docId] || (byDoc[data.docId] = []);
        arr[data.chunkIndex] = data.pages || [];
      });
      S.guidelineChunksByDoc = byDoc;
      render();
    }, function(err){ console.warn("guidelineChunks sub error", err); });
    S.unsubs.push(unsub);
  }
  function subscribeGuidelineRevisions(){
    var unsub = S.db.collection("guidelineRevisions").orderBy("uploadedAt","desc").limit(300).onSnapshot(function(snap){
      var byMajor = {};
      snap.docs.forEach(function(d){
        var data = d.data()||{};
        var arr = byMajor[data.major] || (byMajor[data.major] = []);
        arr.push(Object.assign({}, data, {id:d.id}));
      });
      S.guidelineRevisions = byMajor;
      render();
    }, function(err){ console.warn("guidelineRevisions sub error", err); });
    S.unsubs.push(unsub);
  }

  /* ============ router ============ */
  function route(){
    var h = location.hash.replace(/^#\/?/, "");
    var parts = h.split("/").filter(Boolean);
    return parts;
  }

  function render(){
    var app = document.getElementById("app");
    if(!S.ready){ app.innerHTML = '<div class="loading">불러오는 중…</div>'; return; }
    if(S.noHost){ app.innerHTML = renderConfigGate(); return; }
    if(!S.session){ app.innerHTML = renderAuthPage(); wireAuthPage(); return; }
    if(S.showWelcome){ app.innerHTML = renderWelcomeGate(); wireWelcomeGate(); return; }
    // 모든 기준이 대외비라, 조회자는 팀원/파트장이 승인해줄 때까지 내용을 볼 수 없다.
    if(S.membersReady && !S.viewApproved){
      app.innerHTML = renderPendingViewGate(); wirePendingViewGate(); return;
    }

    var parts = route();
    var listLikeRoutes = ["month","approvals","sites","dept"];
    if(!parts[0] || listLikeRoutes.indexOf(parts[0])!==-1){
      S.lastListHash = location.hash || "#/";
    }
    // 확인필요/필수반영 필터는 목록 화면(홈 · 월별 · 부서별)에만 있는 버튼이라, 그 화면을 완전히
    // 벗어나면(승인대기/현장현황/설정 등) 다음에 목록으로 돌아왔을 때 계속 걸려있지 않도록 풀어준다.
    // 단, 목록에서 카드를 열어 상세 화면(#/item/…)으로 들어간 경우는 "떠난 것"으로 치지 않는다 —
    // 상세 화면의 이전/다음 넘기기도 이 필터를 따라야 하고, 목록으로 돌아왔을 때도 필터가 그대로
    // 유지돼야 하기 때문이다.
    var urgencyFilterRoute = !parts[0] || parts[0]==="month" || (parts[0]==="dept" && parts[1]) || (parts[0]==="item" && parts[1]);
    if(!urgencyFilterRoute && S.filters.urgency){ S.filters.urgency = null; }
    var body = "";
    if((parts[0] === "new" || parts[0] === "edit") && !canWrite()){
      body = renderMessage("등록 권한이 없습니다", "신규 등록·수정은 팀원 또는 파트장으로 지정된 분만 할 수 있어요. 권한이 필요하면 파트장 또는 관리자에게 설정 페이지에서 추가해달라고 요청해주세요.");
    }
    else if(parts[0] === "item" && parts[1]) body = viewItem(parts[1]);
    else if(parts[0] === "new") body = viewForm();
    else if(parts[0] === "edit" && parts[1]) body = viewForm(parts[1]);
    else if(parts[0] === "approvals") body = viewApprovals();
    else if(parts[0] === "settings") body = viewSettings();
    else if(parts[0] === "sites" && parts[1]) body = viewSiteDetail(parts[1]);
    else if(parts[0] === "sites") body = viewSites();
    else if(parts[0] === "dept" && parts[1]){ S.filters.department = decodeURIComponent(parts[1]); body = viewList(null); }
    else if(parts[0] === "dept") body = viewDeptPicker();
    else if(parts[0] === "month" && parts[1]) body = viewList(parts[1]);
    else body = viewList(null);

    app.innerHTML = shell(body);
    wireShell();
    applyLayoutWidths();
    var blockedForm = (parts[0]==="new" || parts[0]==="edit") && !canWrite();
    if(!blockedForm) wireView(parts);
  }

  function renderMessage(title, msg){
    return '<div style="max-width:520px;margin:60px auto;padding:0 16px;text-align:center;">'
      +'<div class="mark" style="font-family:var(--font-d);font-weight:700;font-size:18px;margin-bottom:8px;">'+esc(title)+'</div>'
      +'<div style="color:var(--ink-soft);font-size:13.5px;line-height:1.6;">'+esc(msg)+'</div></div>';
  }

  /* ============ auth gate / login / welcome (no topbar) ============ */
  function authGateLogo(){
    return '<div class="auth-gate-logo">'+LYNN_LOGO_SVG+'<span>Standard</span><span class="brand-dot"></span></div>';
  }
  function renderConfigGate(){
    return '<div class="auth-gate">'
      +'<div class="auth-gate-card">'
        +authGateLogo()
        +'<h1>설정이 필요해요</h1>'
        +'<p>js/config.js 파일에 Supabase 프로젝트 URL과 anon key를 채워 넣어야 사이트가 동작해요. README.md의 배포 가이드를 참고해주세요.</p>'
      +'</div>'
    +'</div>';
  }
  var AUTH_TAB = "login";
  function renderAuthPage(){
    return '<div class="auth-gate">'
      +'<div class="auth-gate-card">'
        +authGateLogo()
        +'<p style="margin-bottom:18px;">건축예산팀 실행파트 · 실행 편성 기준 변경 이력 관리</p>'
        +'<div class="auth-tabs">'
          +'<button type="button" data-auth-tab="login" class="'+(AUTH_TAB==="login"?"on":"")+'">로그인</button>'
          +'<button type="button" data-auth-tab="signup" class="'+(AUTH_TAB==="signup"?"on":"")+'">회원가입</button>'
        +'</div>'
        +'<div class="auth-error" id="authError"></div>'
        +'<div class="f-field"><label for="authEmail">이메일</label><input id="authEmail" type="email" placeholder="name@company.com" autocomplete="email"></div>'
        +'<div class="f-field"><label for="authPassword">비밀번호</label><input id="authPassword" type="password" placeholder="6자 이상" autocomplete="'+(AUTH_TAB==="signup"?"new-password":"current-password")+'"></div>'
        +(AUTH_TAB==="signup" ? '<div class="f-field"><label for="authName">이름</label><input id="authName" type="text" placeholder="실명을 입력해주세요"></div>' : '')
        +'<button class="btn accent" id="btnAuthSubmit" type="button" style="width:100%;">'+(AUTH_TAB==="signup"?"회원가입":"로그인")+'</button>'
        +'<div class="auth-note">조회는 누구나 가능하고, 신규 등록·수정·승인은 팀원 또는 파트장으로 지정된 계정만 할 수 있어요. 새로 가입하면 기본적으로 조회자로 등록돼요.</div>'
      +'</div>'
    +'</div>';
  }
  function wireAuthPage(){
    document.querySelectorAll("[data-auth-tab]").forEach(function(btn){
      btn.addEventListener("click", function(){ AUTH_TAB = btn.getAttribute("data-auth-tab"); render(); });
    });
    var errBox = document.getElementById("authError");
    function showErr(msg){ errBox.textContent = msg; errBox.classList.add("show"); }
    var submitBtn = document.getElementById("btnAuthSubmit");
    submitBtn.addEventListener("click", function(){
      var email = (document.getElementById("authEmail").value||"").trim();
      var pw = document.getElementById("authPassword").value||"";
      if(!email || !pw){ showErr("이메일과 비밀번호를 입력해주세요."); return; }
      submitBtn.disabled = true;
      if(AUTH_TAB === "signup"){
        var nameEl = document.getElementById("authName");
        var name = nameEl ? (nameEl.value||"").trim() : "";
        if(!name){ showErr("이름을 입력해주세요."); submitBtn.disabled=false; return; }
        S.sb.auth.signUp({ email: email, password: pw, options:{ data:{ name: name } } }).then(function(res){
          submitBtn.disabled = false;
          if(res.error){ showErr(res.error.message); return; }
          if(res.data && res.data.session){
            S.showWelcome = true;
          } else {
            showErr("가입 확인 메일을 보냈어요. 메일함에서 확인 링크를 클릭한 뒤 로그인해주세요.");
            AUTH_TAB = "login";
          }
          render();
        }).catch(function(err){ submitBtn.disabled=false; showErr(err.message||"가입 중 오류가 발생했습니다."); });
      } else {
        S.sb.auth.signInWithPassword({ email: email, password: pw }).then(function(res){
          submitBtn.disabled = false;
          if(res.error){ showErr(res.error.message); return; }
          render();
        }).catch(function(err){ submitBtn.disabled=false; showErr(err.message||"로그인 중 오류가 발생했습니다."); });
      }
    });
  }
  function renderWelcomeGate(){
    var name = S.viewerName || "";
    return '<div class="auth-gate">'
      +'<div class="auth-gate-card">'
        +authGateLogo()
        +'<h1>안녕하세요, '+esc(name)+'님</h1>'
        +'<p>Lynn Standard는 건축예산팀 실행파트의 실행 편성 기준 변경사항을 확인하고 관리하는 곳이에요.</p>'
        +'<div class="welcome-role-note">현재 <b>조회자</b>로 등록되어 있어요. 신규 등록·승인 권한이 필요하면 파트장에게 설정 페이지에서 추가해달라고 요청해주세요.</div>'
        +'<button class="btn accent" id="btnWelcomeStart" type="button" style="width:100%;margin-top:16px;">시작하기</button>'
      +'</div>'
    +'</div>';
  }
  function wireWelcomeGate(){
    var btn = document.getElementById("btnWelcomeStart");
    if(!btn) return;
    btn.addEventListener("click", function(){
      S.showWelcome = false;
      render();
    });
  }
  function renderPendingViewGate(){
    var name = S.viewerName || "";
    return '<div class="auth-gate">'
      +'<div class="auth-gate-card">'
        +authGateLogo()
        +'<h1>'+esc(name)+'님, 승인 대기 중이에요</h1>'
        +'<p>실행 편성 기준 변경 이력은 대외비라, 팀원 또는 파트장의 승인을 받은 뒤에 조회할 수 있어요. 팀원 또는 파트장에게 승인을 요청해주세요.</p>'
        +'<div class="welcome-role-note">설정 페이지 &gt; 팀 구성에서 팀원 또는 파트장이 "승인" 버튼을 눌러주면 바로 내용을 볼 수 있어요.</div>'
        +'<button class="btn ghost" id="btnPendingLogout" type="button" style="width:100%;margin-top:16px;">로그아웃</button>'
      +'</div>'
    +'</div>';
  }
  function wirePendingViewGate(){
    var btn = document.getElementById("btnPendingLogout");
    if(!btn) return;
    btn.addEventListener("click", function(){ S.sb.auth.signOut(); });
  }

  /* ============ shell (topbar + sidebar) ============ */
  function pendingCount(){ return S.changes.filter(function(c){ return c.status==="pending"; }).length; }
  function viewerDisplayName(){
    return S.viewerName || "";
  }

  function shell(bodyHtml){
    var pc = pendingCount();
    var parts = route();
    var curMajor = S.filters.major, curMinor = S.filters.minor;

    var sidebarItems = '<div class="cat-item'+(!curMajor?' on':'')+'" data-nav="all">전체 공종<span class="cnt">'+S.changes.length+'</span></div>';
    MAJORS.forEach(function(maj){
      var majCount = S.changes.filter(function(c){ return c.major===maj; }).length;
      var collapsed = !!S.collapsedMajors[maj];
      sidebarItems += '<div class="cat-root'+(curMajor===maj && !curMinor?' on':'')+'" style="--dot:'+MAJOR_COLOR[maj]+';">'
        +'<span class="cat-root-dot"></span>'
        +'<span class="cat-root-label" data-nav-major="'+esc(maj)+'">'+esc(maj)+'</span>'
        +'<span class="cnt">'+majCount+'</span>'
        +'<button class="cat-toggle" data-toggle-major="'+esc(maj)+'" aria-label="'+(collapsed?'펼치기':'접기')+'">'+(collapsed?'+':'&minus;')+'</button>'
      +'</div>';
      if(!collapsed){
        CATEGORY_TREE[maj].forEach(function(min){
          var c = S.changes.filter(function(x){ return x.major===maj && x.minor===min; }).length;
          sidebarItems += '<div class="cat-item'+(curMajor===maj&&curMinor===min?' on':'')+'" data-nav-major="'+esc(maj)+'" data-nav-minor="'+esc(min)+'">'+esc(min)+'<span class="cnt">'+c+'</span></div>';
        });
      }
    });

    return ''
    +'<div class="topbar">'
      +'<div class="brand" data-nav="home"><span class="brand-logo">'+LYNN_LOGO_SVG+'</span><span class="mark">Standard</span><span class="brand-dot"></span><span class="sub">건축예산팀 · 실행파트</span></div>'
      +'<div class="search-wrap"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="M21 21l-3.5-3.5"/></svg>'
        +'<input id="searchInput" type="text" placeholder="공종·내용·#태그 검색" value="'+esc(S.filters.q)+'"></div>'
      +'<div class="topbar-actions">'
        +'<button class="pill tb" data-nav-month="'+ymOf(new Date())+'">이번달</button>'
        +'<button class="pill tb" data-nav="approvals">승인대기'+(pc>0?'<span class="badge">'+pc+'</span>':'')+'</button>'
        +'<button class="pill tb" data-nav="sites">현장현황</button>'
        +'<button class="pill tb" data-nav="dept">부서별</button>'
        +'<button class="pill tb'+(S.docsearchOpen?' on':'')+'" id="docsearchToggleBtn" type="button">✦ 지침서 검색</button>'
        +(canWrite() ? '<button class="btn accent" data-nav="new">+ 신규 등록</button>' : '')
      +'</div>'
      +'<div class="who">'
        +'<button class="who-id" data-nav="settings" type="button" title="설정">'
          +'<span class="who-avatar">'+esc((viewerDisplayName()||"?").slice(0,1))+'</span>'
          +'<span class="name" id="viewerNameSlot">'+esc(viewerDisplayName())+'</span>'
          +'<span class="role'+(S.isPartLeader?' lead':'')+'">'+(S.isPartLeader?'파트장':(S.isTeamMember?'팀원':'조회자'))+'</span>'
        +'</button>'
        +'<span class="who-divider"></span>'
        +'<button class="icon-btn" data-nav="settings" aria-label="설정"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06A1.65 1.65 0 005 15a1.65 1.65 0 00-1.51-1H3.4a2 2 0 010-4h.09A1.65 1.65 0 005 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06A1.65 1.65 0 009 5a1.65 1.65 0 001-1.51V3.4a2 2 0 014 0v.09A1.65 1.65 0 0015 5a1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1h.09a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg></button>'
        +'<button class="icon-btn" id="btnLogout" aria-label="로그아웃" title="로그아웃"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg></button>'
      +'</div>'
    +'</div>'
    +'<div class="layout" id="layoutRoot">'
      +'<details class="sidebar" id="sidebarEl" open>'
        +'<summary>공종 필터 ▾</summary>'
        +'<div class="cat-list">'+sidebarItems+'</div>'
      +'</details>'
      +'<div class="resize-handle" id="handleLeft" data-resize="left"></div>'
      +'<div class="content">'+bodyHtml+'</div>'
      +(S.docsearchOpen ? '<div class="resize-handle" id="handleRight" data-resize="right"></div>'+docsearchPanelHtml() : '')
    +'</div>';
  }

  function applyLayoutWidths(){
    var root = document.getElementById("layoutRoot");
    if(!root) return;
    if(window.innerWidth <= 760) return; // mobile: CSS forces single column
    var cols = S.sidebarW+"px 6px 1fr";
    if(S.docsearchOpen) cols += " 6px "+S.docsearchW+"px";
    root.style.gridTemplateColumns = cols;
  }

  function wireShell(){
    document.querySelectorAll("[data-nav]").forEach(function(el){
      el.addEventListener("click", function(){
        var v = el.getAttribute("data-nav");
        if(v==="all"){ S.filters.major=null; S.filters.minor=null; S.filters.department=null; location.hash="#/"; render(); }
        else if(v==="home"){ S.filters.major=null; S.filters.minor=null; S.filters.department=null; location.hash="#/"; render(); }
        else location.hash = "#/"+v;
      });
    });
    document.querySelectorAll("[data-nav-major]").forEach(function(el){
      el.addEventListener("click", function(){
        S.filters.major = el.getAttribute("data-nav-major");
        S.filters.minor = el.getAttribute("data-nav-minor") || null;
        if(location.hash.indexOf("#/month")===0){ /* keep month */ } else location.hash = "#/";
        render();
      });
    });
    document.querySelectorAll("[data-toggle-major]").forEach(function(el){
      el.addEventListener("click", function(e){
        e.stopPropagation();
        var m = el.getAttribute("data-toggle-major");
        S.collapsedMajors[m] = !S.collapsedMajors[m];
        render();
      });
    });
    document.querySelectorAll("[data-nav-month]").forEach(function(el){
      el.addEventListener("click", function(){ location.hash = "#/month/"+el.getAttribute("data-nav-month"); });
    });
    document.querySelectorAll("[data-go-back]").forEach(function(el){
      el.addEventListener("click", function(e){ e.preventDefault(); history.back(); });
    });
    var si = document.getElementById("searchInput");
    if(si){
      si.addEventListener("input", function(){ S.filters.q = si.value; renderListInPlace(); });
    }
    var logoutBtn = document.getElementById("btnLogout");
    if(logoutBtn) logoutBtn.addEventListener("click", function(){
      if(!S.sb) return;
      logoutBtn.disabled = true;
      S.sb.auth.signOut().then(function(){ location.hash = "#/"; }).catch(function(){ logoutBtn.disabled=false; });
    });
    var dsBtn = document.getElementById("docsearchToggleBtn");
    if(dsBtn) dsBtn.addEventListener("click", function(){
      S.docsearchOpen = !S.docsearchOpen;
      try{ localStorage.setItem("lynn_docsearchOpen", S.docsearchOpen?"1":"0"); }catch(e){}
      render();
    });
    wireResizeHandles();
    if(S.docsearchOpen) wireDocsearchPanel();
  }

  function wireResizeHandles(){
    function startDrag(handle, onMove){
      handle.addEventListener("mousedown", function(e){
        e.preventDefault();
        handle.classList.add("dragging");
        document.body.style.userSelect = "none";
        function move(ev){ onMove(ev.clientX); }
        function up(){
          handle.classList.remove("dragging");
          document.body.style.userSelect = "";
          document.removeEventListener("mousemove", move);
          document.removeEventListener("mouseup", up);
          try{
            localStorage.setItem("lynn_sidebarW", String(S.sidebarW));
            localStorage.setItem("lynn_docsearchW", String(S.docsearchW));
          }catch(err){}
        }
        document.addEventListener("mousemove", move);
        document.addEventListener("mouseup", up);
      });
    }
    var hl = document.getElementById("handleLeft");
    if(hl) startDrag(hl, function(clientX){
      var root = document.getElementById("layoutRoot");
      if(!root) return;
      var rootLeft = root.getBoundingClientRect().left;
      S.sidebarW = Math.max(150, Math.min(420, clientX - rootLeft));
      applyLayoutWidths();
      // 공종 목록(사이드바) 너비를 드래그하는 동안, 상세 페이지 좌우 화살표도 카드 위치를 바로바로 따라가게 한다.
      // (예전에는 드래그가 끝나고 다음 카드로 넘어갈 때만 위치가 갱신돼서, 드래그 직후에는 화살표가
      //  카드 위에 겹쳐 보이는 문제가 있었다.)
      positionDetailNavArrows();
    });
    var hr = document.getElementById("handleRight");
    if(hr) startDrag(hr, function(clientX){
      var root = document.getElementById("layoutRoot");
      if(!root) return;
      var rootRect = root.getBoundingClientRect();
      var rootRight = rootRect.right;
      // 가운데 목록/상세 영역이 완전히 찌그러지지 않을 만큼만 최소로 남겨두고,
      // 나머지는 지침서 검색 패널이 훨씬 넓게 늘어날 수 있게 한다 (예전엔 560px에서 막혀있었다).
      var minContent = 360;
      var maxDocsearch = Math.max(260, rootRect.width - S.sidebarW - 12 - minContent);
      S.docsearchW = Math.max(260, Math.min(maxDocsearch, rootRight - clientX));
      applyLayoutWidths();
      positionDetailNavArrows();
    });
  }

  function renderListInPlace(){
    var parts = route();
    var area = document.getElementById("listArea");
    if(!area) return;
    if(parts[0]==="month" && parts[1]) area.innerHTML = listBody(parts[1]);
    else if(parts[0]!=="item" && parts[0]!=="new" && parts[0]!=="approvals" && parts[0]!=="settings") area.innerHTML = listBody(null);
    else return;
    wireRowsOnly(area);
  }
  function wireRowsOnly(scope){
    (scope||document).querySelectorAll("[data-open]").forEach(function(el){
      el.addEventListener("click", function(){ location.hash = "#/item/"+el.getAttribute("data-open"); });
    });
  }

  /* ============ list / home / month ============ */
  function filteredScoped(monthYm){
    // 상단 검색창에 검색어가 있으면, 지금 어떤 공종 페이지에 있든 전체 범위에서 찾도록
    // 대/중분류 스코프 필터는 건너뛴다 (검색어가 없을 때만 사이드바에서 고른 공종으로 좁힌다).
    var searching = !!S.filters.q;
    return S.changes.filter(function(c){
      if(!searching){
        if(S.filters.major && c.major !== S.filters.major) return false;
        if(S.filters.minor && c.minor !== S.filters.minor) return false;
      }
      if(S.filters.status !== "all" && c.status !== S.filters.status) return false;
      if(S.filters.urgency && c.urgency !== S.filters.urgency) return false;
      if(S.filters.department && (c.department||DEFAULT_DEPARTMENT) !== S.filters.department) return false;
      if(monthYm && (c.changeDate||"").slice(0,7) !== monthYm) return false;
      if(searching){
        var q = S.filters.q.toLowerCase().trim().replace(/^#/, "");
        var hay = [c.title,c.summary,c.reason,c.major,c.minor,(c.tags||[]).join(" ")].join(" ").toLowerCase();
        if(hay.indexOf(q) === -1) return false;
      }
      return true;
    });
  }

  function viewList(monthYm){
    var routeParts = route();
    var deptBackLink = (routeParts[0]==="dept" && routeParts[1]) ? '<a class="back-link" href="#/dept">&larr; 부서 목록으로</a>'
      : (monthYm ? '<a class="back-link" href="#" data-go-back="1">&larr; 이전으로</a>' : "");
    var scopeParts = [];
    if(S.filters.department) scopeParts.push(S.filters.department);
    if(S.filters.minor) scopeParts.push(S.filters.minor); else if(S.filters.major) scopeParts.push(S.filters.major);
    var heading = monthYm ? fmtYm(monthYm)+" 변경사항" : (scopeParts.length ? scopeParts.join(" · ") : "전체 공종 · 최근 변경");
    var d = new Date(monthYm ? monthYm+"-01" : ymOf(new Date())+"-01");
    // 부서별로 조회할 때는 부제목 문구랑 실행지침서 최신 개정 기준선 줄을 안 보여준다 — 부서명 제목만으로 충분하고, 두 줄이 화면을 복잡하게 만들어서.
    var metaText = monthYm ? '해당 월에 등록·승인된 실행 편성 기준 변경 이력' : (S.filters.department ? "" : '전체 공종의 실행 편성 기준 변경 이력 (최신순)');
    var head = deptBackLink + '<div class="content-head"><div><h1 id="listHeading"'+(S.filters.department?' class="dept-heading"':'')+'>'+esc(heading)+'</h1>'
      +(metaText ? '<div class="meta">'+metaText+'</div>' : '')+'</div>';
    if(monthYm){
      var prevD = new Date(d); prevD.setMonth(prevD.getMonth()-1);
      var nextD = new Date(d); nextD.setMonth(nextD.getMonth()+1);
      var curYmForNav = ymOf(new Date());
      var atCurrentMonth = monthYm >= curYmForNav;
      head += '<div class="month-nav">'
        +'<button class="icon-btn" data-nav-month="'+ymOf(prevD)+'">‹</button>'
        +'<input type="month" id="monthPick" value="'+monthYm+'" max="'+curYmForNav+'" style="padding:8px 10px;border:1px solid var(--line);border-radius:8px;background:var(--surface);">'
        +'<button class="icon-btn" data-nav-month="'+ymOf(nextD)+'"'+(atCurrentMonth?' disabled':'')+'>›</button>'
      +'</div>';
    }
    head += '</div>';

    var statBar = "";
    if(!monthYm && !S.filters.major && !S.filters.minor && !S.filters.department){
      var curYm = ymOf(new Date());
      var thisMonthCount = S.changes.filter(function(c){ return (c.changeDate||"").slice(0,7)===curYm; }).length;
      statBar = '<div class="stat-row">'
        +'<button class="stat-tile" type="button" data-stat="all"><div class="n mono">'+S.changes.filter(function(c){return c.status==="approved";}).length+'</div><div class="l">전체 등록 건수</div></button>'
        +'<button class="stat-tile orange" type="button" data-stat="month"><div class="n mono">'+thisMonthCount+'</div><div class="l">이번달 변경 건수</div></button>'
        +'<button class="stat-tile amber" type="button" data-stat="pending"><div class="n mono">'+pendingCount()+'</div><div class="l">승인대기 건수</div></button>'
      +'</div>';
    }

    var banner = "";
    if(pendingCount()>0 && S.isPartLeader){
      banner = '<div class="banner">승인 대기 중인 항목이 '+pendingCount()+'건 있어요.<button class="btn ghost" data-nav="approvals">확인하기</button></div>';
    }

    return head + statBar + guidelineBaselineBannerHtml(monthYm) + banner + filterRow() + '<div id="listArea">'+listBody(monthYm)+'</div>';
  }

  function filterRow(){
    var statuses = [["approved","승인됨"],["pending","대기중"],["rejected","반려됨"],["all","전체"]];
    var urgencies = [["confirm","urgency-confirm","확인필요"],["required","urgency-required","필수반영"]];
    var html = '<div class="filter-row">';
    statuses.forEach(function(s){
      html += '<button class="pill'+(S.filters.status===s[0]?' on':'')+'" data-status="'+s[0]+'">'+s[1]+'</button>';
    });
    if(S.filters.major || S.filters.minor){
      html += '<button class="pill" data-clear-cat="1">'+esc(S.filters.minor||S.filters.major)+' ✕</button>';
    }
    if(S.filters.department){
      html += '<button class="pill" data-clear-dept="1">'+esc(S.filters.department)+' ✕</button>';
    }
    html += '<span class="filter-spacer"></span>';
    urgencies.forEach(function(u){
      html += '<button class="pill '+u[1]+(S.filters.urgency===u[0]?' on':'')+'" data-urgency="'+u[0]+'">'+u[2]+'</button>';
    });
    html += '</div>';
    return html;
  }

  function listBody(monthYm){
    var items = filteredScoped(monthYm);
    if(items.length === 0){
      return '<div class="empty">해당 조건의 변경 이력이 없습니다.'+(S.filters.status==="approved" && !monthYm ? ' 최근 1년간 이 공종은 기준 변경이 없었어요.' : '')+'</div>';
    }
    var searching = !!S.filters.q;
    // group by major then minor for the unfiltered/home browse; otherwise flat sorted list.
    // 검색 중일 때는 결과가 여러 공종에 걸쳐 나올 수 있으므로 공종별로 묶지 않고 평평한 목록 + 공종 칩으로 보여준다.
    if(!S.filters.minor && !monthYm && !searching){
      var byMajor = {};
      items.forEach(function(c){ (byMajor[c.major]=byMajor[c.major]||[]).push(c); });
      var out = "";
      MAJORS.forEach(function(maj){
        if(S.filters.major && S.filters.major!==maj) return;
        var list = byMajor[maj]; if(!list || !list.length) return;
        out += '<div class="section-title" style="--dot:'+MAJOR_COLOR[maj]+';"><span class="dot"></span>'+esc(maj)+'</div>';
        var byMinor = {};
        list.forEach(function(c){ (byMinor[c.minor]=byMinor[c.minor]||[]).push(c); });
        Object.keys(byMinor).sort().forEach(function(min){
          out += '<div class="sub-title">'+esc(min)+'</div><div class="change-list">'+byMinor[min].slice().sort(byDateDesc).map(function(c){ return rowHtml(c, true); }).join("")+'</div>';
        });
      });
      return out || '<div class="empty">해당 조건의 변경 이력이 없습니다.</div>';
    }
    var hideCat = !!S.filters.minor && !searching;
    return '<div class="change-list">'+items.slice().sort(byDateDesc).map(function(c){ return rowHtml(c, hideCat); }).join("")+'</div>';
  }

  // listBody(monthYm)와 똑같은 순서(대공종 → 중분류 알파벳순 → 날짜 내림차순, 필터 적용 시엔 평평하게 날짜순)로
  // 화면에 "실제로 보이는" 항목 배열을 만든다. 상세 화면의 이전/다음 화살표가 화면에 보이던 목록과
  // 똑같은 순서로 넘어가게 하려고, listBody의 렌더링 로직을 그대로 데이터로만 재현한 버전.
  function orderedChangesForList(monthYm){
    var items = filteredScoped(monthYm);
    var searching = !!S.filters.q;
    if(!S.filters.minor && !monthYm && !searching){
      var byMajor = {};
      items.forEach(function(c){ (byMajor[c.major]=byMajor[c.major]||[]).push(c); });
      var out = [];
      MAJORS.forEach(function(maj){
        if(S.filters.major && S.filters.major!==maj) return;
        var list = byMajor[maj]; if(!list || !list.length) return;
        var byMinor = {};
        list.forEach(function(c){ (byMinor[c.minor]=byMinor[c.minor]||[]).push(c); });
        Object.keys(byMinor).sort().forEach(function(min){
          out = out.concat(byMinor[min].slice().sort(byDateDesc));
        });
      });
      return out;
    }
    return items.slice().sort(byDateDesc);
  }

  // 상세 화면에 들어오기 직전에 보고 있던 목록(S.lastListHash: 홈/월별/승인대기)과 같은 순서를 고른다.
  function navListForCurrentContext(){
    var hash = S.lastListHash || "#/";
    if(hash.indexOf("#/approvals") === 0){
      // 승인대기 목록은 필터와 무관하게 대기중 항목 전체를 날짜 내림차순으로 보여준다 (viewApprovals()와 동일).
      return S.changes.filter(function(c){ return c.status==="pending"; }).slice().sort(byDateDesc);
    }
    var m = hash.match(/^#\/month\/([\d-]+)/);
    return orderedChangesForList(m ? m[1] : null);
  }

  function rowHtml(c, hideCat){
    var precision = (c.changeDate||"").length===7 ? "month" : "day";
    return '<button class="row" data-open="'+c.id+'">'
      +'<span class="rowdate mono">'+fmtDate(c.changeDate, precision)+'</span>'
      +(hideCat ? '' : '<span class="chip neutral">'+esc(c.minor)+'</span>')
      +'<div class="rowmain"><div class="rowtitle">'+esc(c.title)+'</div></div>'
      +urgencyChip(c.urgency)
      +statusChip(c.status)
    +'</button>';
  }
  function byDateDesc(a,b){ return (b.changeDate||"").localeCompare(a.changeDate||""); }

  function wireRows(){
    wireRowsOnly(document);
    document.querySelectorAll("[data-status]").forEach(function(el){
      el.addEventListener("click", function(){ S.filters.status = el.getAttribute("data-status"); render(); });
    });
    document.querySelectorAll("[data-urgency]").forEach(function(el){
      el.addEventListener("click", function(){
        var v = el.getAttribute("data-urgency");
        S.filters.urgency = (S.filters.urgency === v) ? null : v;
        render();
      });
    });
    var clearCat = document.querySelector("[data-clear-cat]");
    if(clearCat) clearCat.addEventListener("click", function(){ S.filters.major=null; S.filters.minor=null; render(); });
    var clearDept = document.querySelector("[data-clear-dept]");
    if(clearDept) clearDept.addEventListener("click", function(){ S.filters.department=null; location.hash="#/"; render(); });
    var mp = document.getElementById("monthPick");
    if(mp) mp.addEventListener("change", function(){
      var v = mp.value;
      var curYmForNav = ymOf(new Date());
      if(v > curYmForNav) v = curYmForNav; // 현재 달 이후로는 못 넘어가게
      location.hash = "#/month/"+v;
    });
    document.querySelectorAll("[data-stat]").forEach(function(el){
      el.addEventListener("click", function(){
        var v = el.getAttribute("data-stat");
        if(v==="all"){ S.filters.major=null; S.filters.minor=null; S.filters.status="approved"; S.filters.q=""; S.filters.urgency=null; S.filters.department=null; location.hash="#/"; render(); }
        else if(v==="month"){ S.filters.major=null; S.filters.minor=null; location.hash="#/month/"+ymOf(new Date()); render(); }
        else if(v==="pending"){ location.hash="#/approvals"; render(); }
      });
    });
  }

  /* ============ item detail ============ */
  function viewItem(id){
    var c = S.changes.find(function(x){ return x.id===id; });
    if(!c) return '<div class="detail"><div class="empty">항목을 찾을 수 없습니다.</div></div>';

    // 카드 양옆 이전/다음 화살표: 상세로 들어오기 직전에 보고 있던 목록과 완전히 같은 순서(대공종 →
    // 중분류 → 날짜순 그룹핑까지 포함)로 옆 항목을 찾는다. 그 목록에 없는 항목이면(필터가 바뀐 경우 등)
    // 전체 이력 날짜순으로라도 동작하게 한다.
    var navList = navListForCurrentContext();
    var navIdx = navList.findIndex(function(x){ return x.id === id; });
    if(navIdx === -1){
      navList = S.changes.slice().sort(byDateDesc);
      navIdx = navList.findIndex(function(x){ return x.id === id; });
    }
    var navPrev = navIdx > 0 ? navList[navIdx-1] : null;
    var navNext = (navIdx > -1 && navIdx < navList.length-1) ? navList[navIdx+1] : null;
    var navArrowsHtml = (navPrev ? '<button class="detail-nav-arrow left" data-detail-nav="'+navPrev.id+'" type="button" aria-label="이전 이력">&lsaquo;</button>' : '')
      + (navNext ? '<button class="detail-nav-arrow right" data-detail-nav="'+navNext.id+'" type="button" aria-label="다음 이력">&rsaquo;</button>' : '');
    var precision = (c.changeDate||"").length===7 ? "month" : "day";
    if(S.attachItemId !== id){ S.attachItemId = id; S.attachIndex = 0; }

    var items = (c.execItems||[]).map(function(it){
      return '<tr><td>'+esc(it.name)+'</td><td>'+esc(it.spec)+'</td><td>'+esc(it.unit)+'</td>'
        +'<td class="num">'+esc(it.qty||"-")+'</td><td class="num">'+fmtMoney(it.unitPrice)+'</td></tr>';
    }).join("");
    var execBlock = items ? '<div class="block"><h3>실행양식 반영 내역 <button class="btn ghost" id="btnCopyExec" type="button" style="font-size:11px;padding:4px 10px;margin-left:6px;">⧉ 실행양식 복사</button></h3><div class="table-wrap"><table class="exec">'
      +'<thead><tr><th>품명</th><th>규격</th><th>단위</th><th>수량</th><th>단가</th></tr></thead><tbody>'+items+'</tbody></table></div></div>' : "";

    var tagsBlock = (c.tags && c.tags.length) ? '<div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:10px;">'
      +c.tags.map(function(t){ return '<span class="chip tagchip" data-tag-click="'+esc(t)+'">#'+esc(t)+'</span>'; }).join("")
    +'</div>' : "";

    var attachments = c.attachments || [];
    var attachBlock = "";
    if(attachments.length){
      if(S.attachIndex >= attachments.length || S.attachIndex < 0) S.attachIndex = 0;
      var ai = S.attachIndex;
      var a = attachments[ai];
      var body; var zoomable = false;
      if(a.contentType === "application/pdf"){
        body = '<div class="att-pdf-host" id="attPdfHost"><div class="att-fallback" style="padding:14px;font-size:12px;color:var(--ink-faint);">PDF 불러오는 중…</div></div>';
        zoomable = true;
      } else if((a.contentType||"").indexOf("image/")===0){
        body = '<img id="attImg" src="'+a.url+'" alt="'+esc(a.name)+'" onerror="this.parentElement.querySelector(\'.att-fallback\').style.display=\'block\';this.style.display=\'none\';">' + '<div class="att-fallback" style="display:none;padding:14px;font-size:12px;color:var(--ink-faint);">이미지를 불러오지 못했습니다. 아래 링크로 열어주세요.</div>';
        zoomable = true;
      } else if(isExcelMime(a.contentType)){
        body = '<div class="att-excel-host" id="attExcelHost" data-kind="excel"><div class="att-fallback" style="padding:14px;font-size:12px;color:var(--ink-faint);">표 불러오는 중…</div></div>'
          + (a.sheetCount>1 ? '<div class="att-excel-note">첫 번째 시트만 미리보기에 반영돼요 (전체 '+a.sheetCount+'개 시트)</div>' : '');
      } else if(a.contentType === "text/csv"){
        body = '<div class="att-excel-host" id="attExcelHost" data-kind="csv"><div class="att-fallback" style="padding:14px;font-size:12px;color:var(--ink-faint);">표 불러오는 중…</div></div>';
      } else if(a.contentType === "message/rfc822"){
        body = '<div class="att-eml-host" id="attEmlHost"><div class="att-fallback" style="padding:14px;font-size:12px;color:var(--ink-faint);">이메일 불러오는 중…</div></div>';
      } else {
        body = '<div style="padding:10px;font-size:12px;color:var(--ink-faint);">이 형식은 미리보기를 지원하지 않습니다.</div>';
      }
      var navHtml = attachments.length > 1
        ? '<button class="att-arrow" id="attPrev" type="button" aria-label="이전 파일">‹</button>'
          +'<span class="att-count mono">'+(ai+1)+' / '+attachments.length+'</span>'
          +'<button class="att-arrow" id="attNext" type="button" aria-label="다음 파일">›</button>'
        : '';
      attachBlock = '<div class="block"><h3>결재본 / 첨부자료</h3><div class="attach-item">'
        +'<div class="att-head"><span class="fn">'+esc(a.name)+'</span>'+navHtml+'<a href="'+a.url+'" target="_blank" rel="noopener" class="att-open">새 창에서 열기 ↗</a></div>'
        +'<div class="att-viewport" id="attZoomScroll">'+body+'</div>'
        +(zoomable ? zoomWidgetHtml("att") : "")
      +'</div></div>';
    }

    var reasonBlock = c.reason ? '<div class="block"><h3>변경 사유</h3><p>'+esc(c.reason)+'</p></div>' : "";

    // "수정"/"삭제" 버튼은 각자 따로 줄을 차지하던 것을, 카드 오른쪽 아래에 작은 크기로 나란히 모아둔다.
    var editBtnHtml = "";
    var approveBar = "";
    if(c.status==="pending"){
      if(S.isPartLeader){
        var pendingEditBtn = canEditChange(c) ? '<button class="btn ghost" id="btnEditChange" type="button">수정</button>' : "";
        approveBar = '<div class="approve-bar">'
          + pendingEditBtn
          +'<button class="btn" id="btnApprove">승인</button>'
          +'<button class="btn danger" id="btnRejectToggle">반려</button>'
        +'</div>'
        +'<div class="reject-box" id="rejectBox"><textarea id="rejectReason" placeholder="반려 사유를 입력해주세요"></textarea>'
          +'<div style="display:flex;gap:8px;"><button class="btn danger" id="btnRejectConfirm">반려 확정</button><button class="btn ghost" id="btnRejectCancel">취소</button></div></div>';
      } else {
        approveBar = '<div class="banner info">파트장 승인 대기 중입니다.</div>';
        editBtnHtml = canEditChange(c) ? '<button class="btn ghost sm" id="btnEditChange" type="button">수정</button>' : "";
      }
    } else if(c.status==="rejected" && c.rejectReason){
      approveBar = '<div class="block"><h3>반려 사유</h3><p>'+esc(c.rejectReason)+'</p></div>';
    } else if(c.status==="approved"){
      editBtnHtml = canEditChange(c) ? '<button class="btn ghost sm" id="btnEditChange" type="button">수정</button>' : "";
    }

    var deleteBtnHtml = canDelete() ? '<button class="btn danger sm" id="btnDeleteToggle" type="button">삭제</button>' : "";
    var actionsRow = (editBtnHtml || deleteBtnHtml) ? '<div class="card-actions">'+editBtnHtml+deleteBtnHtml+'</div>' : "";
    var deleteBlock = "";
    if(canDelete()){
      var delOpen = S.deleteConfirmId === c.id;
      deleteBlock = '<div class="delete-box'+(delOpen?' show':'')+'" id="deleteBox">'
        +'<div class="meta" style="color:var(--bad);">이 항목을 삭제하면 되돌릴 수 없습니다. 정말 삭제할까요?</div>'
        +'<div style="display:flex;gap:8px;"><button class="btn danger" id="btnDeleteConfirm" type="button">삭제 확정</button><button class="btn ghost" id="btnDeleteCancel" type="button">취소</button></div>'
      +'</div>';
    }

    return '<div class="detail">'
      +navArrowsHtml
      +'<a class="back-link" href="'+esc(S.lastListHash)+'">&larr; 목록으로</a>'
      +'<div class="detail-card">'
        +'<div class="detail-crumb">'+esc(c.major)+' / '+esc(c.minor)+'</div>'
        +'<div class="detail-top"><h2>'+esc(c.title)+'</h2><div style="display:flex;gap:6px;flex-wrap:wrap;flex-shrink:0;">'+urgencyChip(c.urgency)+statusChip(c.status)+'</div></div>'
        +tagsBlock
        +'<div class="fact-line">'
          +'<span class="fl-item"><b>날짜</b><span class="fl-val mono">'+fmtDate(c.changeDate,precision)+'</span></span>'
          +'<span class="fl-item"><b>유관부서</b><span class="fl-val">'+esc(c.department||DEFAULT_DEPARTMENT)+'</span></span>'
          +'<span class="fl-item"><b>적용현장</b><span class="fl-val">'+esc(c.effectiveScope||"전현장")+'</span></span>'
          +'<span class="fl-item"><b>등록자</b><span class="fl-val">'+userLabel(c.submittedById, c.submittedByName, "초기 등록")+'</span></span>'
        +'</div>'
        +'<div class="block"><h3>실행 반영 내용</h3><p>'+esc(c.summary)+'</p></div>'
        +execBlock + attachBlock + reasonBlock + approveBar + actionsRow + deleteBlock
      +'</div>'
    +'</div>';
  }

  // 이전/다음 화살표(position:fixed)를 지금 카드의 실제 위치에 맞춰 배치한다.
  // top은 카드 내용 길이와 무관하게 항상 같은 값(화면상 고정된 자리)을 쓰고,
  // left/right만 카드의 실제 가로 위치(사이드바 폭 조절 등 반영)에 맞춰 매번 다시 계산한다.
  function positionDetailNavArrows(){
    var card = document.querySelector(".detail-card");
    if(!card) return;
    var rect = card.getBoundingClientRect();
    var fixedTop = 280; // 화면 상단에서부터 고정된 위치 — 카드마다 높이가 달라도 항상 여기.
    var left = document.querySelector(".detail-nav-arrow.left");
    var right = document.querySelector(".detail-nav-arrow.right");
    if(left){ left.style.top = fixedTop+"px"; left.style.left = (rect.left-48)+"px"; }
    if(right){ right.style.top = fixedTop+"px"; right.style.left = (rect.right+8)+"px"; }
  }

  function wireItem(id){
    var c = S.changes.find(function(x){ return x.id===id; });
    if(!c) return;
    resolveNames();
    positionDetailNavArrows();
    document.querySelectorAll("[data-detail-nav]").forEach(function(el){
      el.addEventListener("click", function(){ location.hash = "#/item/"+el.getAttribute("data-detail-nav"); });
    });
    var attachments = c.attachments || [];
    var curAtt = attachments[S.attachIndex];
    var attZoomScroll = document.getElementById("attZoomScroll");
    var pdfHost = document.getElementById("attPdfHost");
    if(pdfHost && curAtt){
      renderPdfInto(pdfHost, curAtt.url, function(){
        wireZoomWidget("att", attZoomScroll, pdfHost);
      });
    }
    var excelHost = document.getElementById("attExcelHost");
    if(excelHost && curAtt){
      if(excelHost.getAttribute("data-kind")==="csv") renderCsvInto(excelHost, curAtt.url);
      else renderExcelInto(excelHost, curAtt.url);
    }
    var emlHost = document.getElementById("attEmlHost");
    if(emlHost && curAtt){ renderEmlInto(emlHost, curAtt.url); }
    var attImg = document.getElementById("attImg");
    if(attImg && curAtt){ wireZoomWidget("att", attZoomScroll, attImg); }
    var attPrev = document.getElementById("attPrev");
    if(attPrev) attPrev.addEventListener("click", function(){
      S.attachIndex = (S.attachIndex - 1 + attachments.length) % attachments.length;
      render();
    });
    var attNext = document.getElementById("attNext");
    if(attNext) attNext.addEventListener("click", function(){
      S.attachIndex = (S.attachIndex + 1) % attachments.length;
      render();
    });
    var ce = document.getElementById("btnCopyExec");
    if(ce) ce.addEventListener("click", function(){
      var rows = (c.execItems||[]).map(function(it){ return [it.name||"",it.spec||"",it.unit||"",it.qty||"",it.unitPrice||""].join("\t"); });
      var tsv = rows.join("\n");
      copyText(tsv).then(function(){ toast("실행양식을 복사했습니다. Excel에 표 아래 붙여넣으세요."); }).catch(function(){ toast("복사에 실패했습니다."); });
    });
    document.querySelectorAll("[data-tag-click]").forEach(function(el){
      el.addEventListener("click", function(){
        S.filters.q = "#"+el.getAttribute("data-tag-click");
        S.filters.major = null; S.filters.minor = null;
        location.hash = "#/"; render();
      });
    });
    var ed = document.getElementById("btnEditChange");
    if(ed) ed.addEventListener("click", function(){ location.hash = "#/edit/"+id; });
    var ap = document.getElementById("btnApprove");
    if(ap) ap.addEventListener("click", function(){ approveItem(id); });
    var rt = document.getElementById("btnRejectToggle");
    if(rt) rt.addEventListener("click", function(){ document.getElementById("rejectBox").classList.add("show"); });
    var rc = document.getElementById("btnRejectCancel");
    if(rc) rc.addEventListener("click", function(){ document.getElementById("rejectBox").classList.remove("show"); });
    var rk = document.getElementById("btnRejectConfirm");
    if(rk) rk.addEventListener("click", function(){
      var reason = document.getElementById("rejectReason").value.trim();
      if(!reason){ toast("반려 사유를 입력해주세요."); return; }
      rejectItem(id, reason);
    });
    var dt = document.getElementById("btnDeleteToggle");
    if(dt) dt.addEventListener("click", function(){ S.deleteConfirmId = id; document.getElementById("deleteBox").classList.add("show"); });
    var dc = document.getElementById("btnDeleteCancel");
    if(dc) dc.addEventListener("click", function(){ S.deleteConfirmId = null; document.getElementById("deleteBox").classList.remove("show"); });
    var dk = document.getElementById("btnDeleteConfirm");
    if(dk) dk.addEventListener("click", function(){ deleteChange(id); });
  }

  function deleteChange(id){
    if(!S.db || !canDelete()) return;
    S.db.doc("changes/"+id).delete().then(function(){
      toast("삭제되었습니다.");
      S.deleteConfirmId = null;
      location.hash = S.lastListHash || "#/";
    }).catch(function(err){
      console.warn(err);
      toast("삭제 중 오류가 발생했습니다.");
    });
  }

  function approveItem(id){
    if(!S.db) return;
    S.db.doc("changes/"+id).update({ status:"approved", approvedById:S.viewerId, approvedByName:S.viewerName||"", approvedAt: nowIso() })
      .then(function(){ toast("승인되었습니다."); })
      .catch(function(){ toast("승인 처리 중 오류가 발생했습니다."); });
  }
  function rejectItem(id, reason){
    if(!S.db) return;
    S.db.doc("changes/"+id).update({ status:"rejected", approvedById:S.viewerId, approvedByName:S.viewerName||"", approvedAt: nowIso(), rejectReason: reason })
      .then(function(){ toast("반려되었습니다."); })
      .catch(function(){ toast("반려 처리 중 오류가 발생했습니다."); });
  }

  /* ============ resolve display names ============ */
  function userLabel(id, fallbackName, emptyLabel){
    if(!id) return esc(emptyLabel||"");
    return '<span class="uname" data-uid="'+esc(id)+'" data-fallback="'+esc(fallbackName||"")+'">'+esc(fallbackName||"…")+'</span>';
  }
  function resolveNames(){
    var nodes = document.querySelectorAll(".uname[data-uid]");
    nodes.forEach(function(n){
      var id = n.getAttribute("data-uid");
      var m = S.members && S.members[id];
      var fallback = n.getAttribute("data-fallback") || "이름 비공개";
      var live = m && m.name;
      n.textContent = live || fallback;
    });
  }

  /* ============ new entry form ============ */
  function viewForm(editId){
    var c = editId ? S.changes.find(function(x){ return x.id===editId; }) : null;
    if(editId && !canEditChange(c)){
      return '<div class="detail"><a class="back-link" href="'+esc(S.lastListHash)+'">&larr; 목록으로</a><div class="empty">수정할 수 없는 항목입니다. 대기중 상태이면서 등록자 본인 또는 파트장인 경우, 혹은 승인완료 상태이면서 파트장인 경우에만 수정할 수 있어요.</div></div>';
    }
    if(S.formEditId !== (editId||null)){
      S.formEditId = editId || null;
      if(c){
        S.formExecItems = (c.execItems||[]).map(function(it){ return Object.assign({},it); });
        S.formAttachments = (c.attachments||[]).map(function(a){ return Object.assign({},a); });
        S.formDraft = {
          changeDate: c.changeDate||"", major: c.major||"", minor: c.minor||"", urgency: c.urgency||"",
          department: c.department||DEFAULT_DEPARTMENT,
          title: c.title||"", summary: c.summary||"", effScope: c.effectiveScope||"전현장",
          tags: (c.tags||[]).join(", "), reason: c.reason||"",
          secReasonOpen: !!c.reason, secExecOpen: !!(c.execItems||[]).length, secFilesOpen: !!(c.attachments||[]).length
        };
      } else {
        S.formExecItems = [];
        S.formAttachments = [];
        S.formDraft = {
          changeDate: new Date().toISOString().slice(0,10), major: S.filters.major||"", minor: S.filters.minor||"",
          urgency: "", department: DEFAULT_DEPARTMENT,
          title: "", summary: "", effScope: "전현장", tags: "", reason: "",
          secReasonOpen:false, secExecOpen:false, secFilesOpen:false
        };
      }
    }
    S.formExecItems = S.formExecItems.length ? S.formExecItems : [{name:"",spec:"",unit:"",qty:"",unitPrice:"",amount:""}];
    var majorOpts = MAJORS.map(function(m){ return '<option value="'+esc(m)+'">'+esc(m)+'</option>'; }).join("");
    var deptOpts = DEPARTMENTS.map(function(d){ return '<option value="'+esc(d)+'">'+esc(d)+'</option>'; }).join("");
    var showApproveCombo = c && S.isPartLeader && c.status==="pending";
    var actionsHtml = showApproveCombo
      ? '<div class="form-actions"><button class="btn ghost" id="cancelForm" type="button">취소</button><button class="btn ghost" id="submitForm" type="button">저장만 (승인 대기 유지)</button><button class="btn" id="submitApproveForm" type="button">수정 후 승인</button></div>'
      : '<div class="form-actions"><button class="btn ghost" id="cancelForm" type="button">취소</button><button class="btn" id="submitForm" type="button">'+(c?'수정 완료':'등록하기')+'</button></div>';
    return '<div class="detail">'
      +'<a class="back-link" href="'+(c ? '#/item/'+editId : '#/')+'">&larr; '+(c?'상세로':'목록으로')+'</a>'
      +'<div class="form-card">'
        +'<h2 style="font-family:var(--font-d);font-size:18px;margin:0 0 4px;">'+(c?'기준 변경 수정':'신규 기준 변경 등록')+'</h2>'
        +'<div class="meta" style="color:var(--ink-faint);font-size:12.5px;margin-bottom:18px;">'+(c?(showApproveCombo?'내용을 수정하고 바로 승인하거나, 승인 대기 상태를 유지한 채 저장할 수 있어요.':'대기중 상태에서만 수정할 수 있어요. 수정 후에도 파트장 승인이 필요합니다.'):'등록 후 파트장 승인을 거쳐 목록에 정식 반영됩니다.')+'</div>'
        +'<div class="f-row-3">'
          +'<div class="f-field"><label for="f-changeDate">날짜 (등록일 / 기준변경 시점)</label><input id="f-changeDate" type="date"></div>'
          +'<div class="f-field"><label for="f-effScope">적용 현장</label><input id="f-effScope" type="text" placeholder="전현장 (또는 예: OO현장부터, LH현장)" value="전현장"></div>'
          +'<div class="f-field"><label for="f-department">유관부서</label><select id="f-department">'+deptOpts+'</select></div>'
        +'</div>'
        +'<div class="f-row-3">'
          +'<div class="f-field"><label for="f-major">대분류</label><select id="f-major">'+majorOpts+'</select></div>'
          +'<div class="f-field"><label for="f-minor">중분류(공종)</label><select id="f-minor"></select></div>'
          +'<div class="f-field"><label for="f-urgency">중요도</label><select id="f-urgency">'
            +'<option value="">일반</option>'
            +'<option value="required">🔴 필수반영</option>'
            +'<option value="confirm">🟡 확인필요</option>'
          +'</select></div>'
        +'</div>'
        +'<div class="f-grid">'
          +'<div class="f-field full"><label for="f-title">핵심 제목</label><input id="f-title" type="text" placeholder="예: 이동식 미스트 반영" maxlength="80"></div>'
          +'<div class="f-field full"><label for="f-summary">실행 반영 내용</label><textarea id="f-summary" placeholder="예: 500세대 이하 2대, +500세대 마다 1대"></textarea></div>'
        +'</div>'
        +'<details class="f-details" id="secExec"><summary>실행양식 (선택)</summary><div class="f-details-body">'
          +'<div id="execRows"></div>'
          +'<button class="btn ghost" id="addExecRow" type="button" style="font-size:12px;padding:6px 12px;">+ 행 추가</button>'
        +'</div></details>'
        +'<details class="f-details" id="secReason"><summary>변경 사유 (선택)</summary><div class="f-details-body">'
          +'<textarea id="f-reason" placeholder="배경, 지시자, 근거 등" style="width:100%;"></textarea>'
        +'</div></details>'
        +'<details class="f-details" id="secFiles"><summary>첨부자료 (선택)</summary><div class="f-details-body">'
          +'<div class="file-drop">PDF · 이미지(PNG/JPG) · Excel(XLSX/XLS) · CSV · TXT · 이메일(EML) 파일을 첨부할 수 있어요.<br>Word·PPT 원본은 PDF로 변환 후 첨부해주세요.<br><input type="file" id="f-files" multiple accept=".pdf,.png,.jpg,.jpeg,.gif,.webp,.csv,.txt,.md,.json,.xlsx,.xls,.eml" style="margin-top:8px;"></div>'
          +'<div class="file-chips" id="fileChips"></div>'
        +'</div></details>'
        +'<div class="f-field full" style="margin-top:6px;"><label for="f-tags">태그 (선택, 쉼표로 구분)</label><input id="f-tags" type="text" placeholder="예: 방수, 단열, LH"></div>'
        + actionsHtml
      +'</div>'
    +'</div>';
  }

  function renderExecRows(){
    var wrap = document.getElementById("execRows");
    if(!wrap) return;
    wrap.innerHTML = S.formExecItems.map(function(it, i){
      return '<div class="exec-row">'
        +'<input data-f="name" data-i="'+i+'" placeholder="품명" value="'+esc(it.name)+'">'
        +'<input data-f="spec" data-i="'+i+'" placeholder="규격" value="'+esc(it.spec)+'">'
        +'<input data-f="unit" data-i="'+i+'" placeholder="단위" value="'+esc(it.unit)+'">'
        +'<input data-f="qty" data-i="'+i+'" inputmode="decimal" placeholder="수량" value="'+esc(it.qty)+'">'
        +'<input data-f="unitPrice" data-i="'+i+'" inputmode="numeric" placeholder="단가" value="'+esc(it.unitPrice)+'">'
        +'<input data-f="amount" data-i="'+i+'" placeholder="금액" value="'+esc(it.amount)+'" readonly style="background:var(--surface-2);color:var(--ink-soft);">'
        +'<button class="rm" type="button" data-rm="'+i+'">✕</button>'
      +'</div>';
    }).join("");
    function recalc(i){
      var it = S.formExecItems[i];
      var qty = parseNum(it.qty), price = parseNum(it.unitPrice);
      if(!isNaN(qty) && !isNaN(price)){
        it.amount = fmtNum(qty*price);
      } else {
        it.amount = "";
      }
      var amtInput = wrap.querySelector('input[data-f="amount"][data-i="'+i+'"]');
      if(amtInput) amtInput.value = it.amount;
    }
    wrap.querySelectorAll('input[data-f="name"], input[data-f="spec"], input[data-f="unit"]').forEach(function(inp){
      inp.addEventListener("input", function(){
        S.formExecItems[+inp.getAttribute("data-i")][inp.getAttribute("data-f")] = inp.value;
      });
    });
    wrap.querySelectorAll('input[data-f="qty"]').forEach(function(inp){
      ["input","change","blur"].forEach(function(evt){
        inp.addEventListener(evt, function(){
          var i = +inp.getAttribute("data-i");
          S.formExecItems[i].qty = inp.value;
          recalc(i);
        });
      });
    });
    wrap.querySelectorAll('input[data-f="unitPrice"]').forEach(function(inp){
      ["input","change","blur"].forEach(function(evt){
        inp.addEventListener(evt, function(){
          var i = +inp.getAttribute("data-i");
          var digits = inp.value.replace(/[^0-9]/g,"");
          var formatted = digits ? Number(digits).toLocaleString("ko-KR") : "";
          if(inp.value !== formatted) inp.value = formatted;
          S.formExecItems[i].unitPrice = formatted;
          recalc(i);
        });
      });
    });
    wrap.querySelectorAll("[data-rm]").forEach(function(btn){
      btn.addEventListener("click", function(){
        S.formExecItems.splice(+btn.getAttribute("data-rm"), 1);
        if(!S.formExecItems.length) S.formExecItems.push({name:"",spec:"",unit:"",qty:"",unitPrice:"",amount:""});
        renderExecRows();
      });
    });
  }

  function renderFileChips(){
    var wrap = document.getElementById("fileChips");
    if(!wrap) return;
    wrap.innerHTML = S.formAttachments.map(function(a,i){
      return '<div class="file-chip"><span>'+esc(a.name)+'</span><button type="button" data-rmfile="'+i+'">✕</button></div>';
    }).join("");
    wrap.querySelectorAll("[data-rmfile]").forEach(function(btn){
      btn.addEventListener("click", function(){ S.formAttachments.splice(+btn.getAttribute("data-rmfile"),1); renderFileChips(); });
    });
  }

  function readFileArrayBuffer(file){
    return new Promise(function(resolve, reject){
      var reader = new FileReader();
      reader.onload = function(){ resolve(reader.result); };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  }

  // 첨부파일을 Supabase Storage에 업로드하고, execItem 폼에 붙일 메타데이터를 만든다.
  // 엑셀 파일은 (CSV로 변환하지 않고) 원본 그대로 올린 뒤, 미리보기 때 SheetJS로 직접 읽는다.
  function uploadAttachment(file, mime){
    if(!S.sb){ toast("파일 저장 기능을 사용할 수 없습니다."); return; }
    // Supabase Storage 키는 한글 등 비-ASCII 문자가 섞여 있으면 "InvalidKey" 오류로 업로드가 거부된다.
    // 원본 파일명(meta.name, 화면에 보여줄 이름)은 한글 그대로 두되, 실제 저장 경로(path)에서는
    // 한글을 전부 밑줄로 바꿔서 항상 ASCII만 남긴다 (예전엔 한글을 그대로 허용해서 한글 파일명이면 업로드가 실패했음).
    var path = Date.now()+"_"+Math.random().toString(36).slice(2,8)+"_"+file.name.replace(/[^\w.\-]/g,"_");
    var meta = { name: file.name, contentType: mime };
    var afterMeta = Promise.resolve();
    if(EXCEL_EXT["."+(file.name.split(".").pop()||"").toLowerCase()] && window.XLSX){
      afterMeta = readFileArrayBuffer(file).then(function(buf){
        try{
          var wb = XLSX.read(new Uint8Array(buf), {type:"array"});
          meta.sheetCount = wb.SheetNames.length;
        }catch(e){}
      }).catch(function(){});
    }
    return afterMeta.then(function(){
      return S.sb.storage.from("attachments").upload(path, file, { contentType: mime, upsert:false });
    }).then(function(res){
      if(res.error) throw res.error;
      var pub = S.sb.storage.from("attachments").getPublicUrl(path);
      meta.url = pub.data.publicUrl;
      meta.id = path;
      S.formAttachments.push(meta);
      renderFileChips();
      toast(file.name + " 첨부 완료");
    }).catch(function(err){
      console.warn(err);
      toast(file.name + " 업로드 중 오류가 발생했습니다.");
    });
  }

  function wireForm(editId){
    var c = editId ? S.changes.find(function(x){ return x.id===editId; }) : null;
    if(editId && !canEditChange(c)) return;
    // 지침서 검색 패널을 열거나 검색하는 동안에도 render()가 다시 호출되면서 폼이 통째로 다시 그려지는데,
    // 그때 왼쪽에 입력해둔 내용이 사라지지 않도록 모든 입력값을 S.formDraft(초안)에 실시간으로 저장해두고,
    // 폼을 다시 그릴 때마다 이 초안 값으로 채운다.
    var draft = S.formDraft;
    var majorSel = document.getElementById("f-major");
    var minorSel = document.getElementById("f-minor");
    function fillMinor(){
      minorSel.innerHTML = CATEGORY_TREE[majorSel.value].map(function(m){ return '<option value="'+esc(m)+'">'+esc(m)+'</option>'; }).join("");
    }
    if(draft.major) majorSel.value = draft.major;
    fillMinor();
    if(draft.minor && CATEGORY_TREE[majorSel.value].indexOf(draft.minor)!==-1) minorSel.value = draft.minor;
    draft.minor = minorSel.value;
    majorSel.addEventListener("change", function(){
      draft.major = majorSel.value;
      fillMinor();
      draft.minor = minorSel.value;
    });
    minorSel.addEventListener("change", function(){ draft.minor = minorSel.value; });

    document.getElementById("f-title").value = draft.title;
    document.getElementById("f-summary").value = draft.summary;
    document.getElementById("f-changeDate").value = draft.changeDate;
    document.getElementById("f-effScope").value = draft.effScope;
    document.getElementById("f-urgency").value = draft.urgency;
    document.getElementById("f-department").value = draft.department || DEFAULT_DEPARTMENT;
    document.getElementById("f-tags").value = draft.tags;
    document.getElementById("f-reason").value = draft.reason;
    if(draft.secReasonOpen) document.getElementById("secReason").open = true;
    if(draft.secExecOpen) document.getElementById("secExec").open = true;
    if(draft.secFilesOpen) document.getElementById("secFiles").open = true;

    document.getElementById("f-title").addEventListener("input", function(e){ draft.title = e.target.value; });
    document.getElementById("f-summary").addEventListener("input", function(e){ draft.summary = e.target.value; });
    document.getElementById("f-changeDate").addEventListener("input", function(e){ draft.changeDate = e.target.value; });
    document.getElementById("f-effScope").addEventListener("input", function(e){ draft.effScope = e.target.value; });
    document.getElementById("f-urgency").addEventListener("change", function(e){ draft.urgency = e.target.value; });
    document.getElementById("f-department").addEventListener("change", function(e){ draft.department = e.target.value; });
    document.getElementById("f-tags").addEventListener("input", function(e){ draft.tags = e.target.value; });
    document.getElementById("f-reason").addEventListener("input", function(e){ draft.reason = e.target.value; });
    [["secReason","secReasonOpen"],["secExec","secExecOpen"],["secFiles","secFilesOpen"]].forEach(function(pair){
      var el = document.getElementById(pair[0]);
      if(el) el.addEventListener("toggle", function(){ draft[pair[1]] = el.open; });
    });

    renderExecRows();
    renderFileChips();

    document.getElementById("addExecRow").addEventListener("click", function(){
      S.formExecItems.push({name:"",spec:"",unit:"",qty:"",unitPrice:"",amount:""});
      renderExecRows();
    });

    document.getElementById("f-files").addEventListener("change", function(e){
      var files = Array.prototype.slice.call(e.target.files||[]);
      files.forEach(function(file){
        var ext = "." + (file.name.split(".").pop()||"").toLowerCase();
        var mime = ACCEPT_EXT[ext];
        if(!mime){
          toast(file.name + " : 지원하지 않는 형식입니다 (PDF/이미지/Excel/CSV/TXT/EML만 가능)");
          return;
        }
        uploadAttachment(file, mime);
      });
      e.target.value = "";
    });

    document.getElementById("cancelForm").addEventListener("click", function(){ location.hash = c ? "#/item/"+editId : "#/"; });
    document.getElementById("submitForm").addEventListener("click", function(){ submitForm(editId, false); });
    var apBtn = document.getElementById("submitApproveForm");
    if(apBtn) apBtn.addEventListener("click", function(){ submitForm(editId, true); });
  }

  function submitForm(editId, alsoApprove){
    if(!canWrite()){ toast("신규등록·수정 권한이 없습니다."); return; }
    var title = document.getElementById("f-title").value.trim();
    var summary = document.getElementById("f-summary").value.trim();
    var major = document.getElementById("f-major").value;
    var minor = document.getElementById("f-minor").value;
    var changeDate = document.getElementById("f-changeDate").value;
    var effScope = document.getElementById("f-effScope").value.trim() || "전현장";
    var reason = document.getElementById("f-reason").value.trim();
    var urgency = document.getElementById("f-urgency").value;
    var department = document.getElementById("f-department").value || DEFAULT_DEPARTMENT;
    var tags = document.getElementById("f-tags").value.split(",").map(function(s){ return s.trim().replace(/^#/,""); }).filter(Boolean);

    if(!title || !summary || !changeDate){ toast("핵심 제목, 실행 반영 내용, 날짜는 필수입니다."); return; }
    if(!S.db){ toast("저장 기능을 사용할 수 없습니다."); return; }

    var execItems = S.formExecItems.filter(function(it){ return it.name || it.spec; });
    var payload = {
      major: major, minor: minor, title: title, summary: summary, department: department,
      changeDate: changeDate, effectiveDate: changeDate, effectiveScope: effScope,
      reason: reason, urgency: urgency, tags: tags, execItems: execItems, attachments: S.formAttachments
    };

    if(editId){
      var existing = S.changes.find(function(x){ return x.id===editId; });
      if(!canEditChange(existing)){ toast("수정할 수 없는 항목입니다."); return; }
      payload.editedById = S.viewerId; payload.editedByName = S.viewerName||""; payload.editedAt = nowIso();
      if(alsoApprove && S.isPartLeader){
        payload.status = "approved"; payload.approvedById = S.viewerId; payload.approvedByName = S.viewerName||""; payload.approvedAt = nowIso();
      }
      S.db.doc("changes/"+editId).update(payload).then(function(){
        toast(alsoApprove ? "수정 후 승인되었습니다." : "수정되었습니다.");
        S.formExecItems = []; S.formAttachments = []; S.formEditId = undefined; S.formDraft = null;
        location.hash = "#/item/"+editId;
      }).catch(function(err){
        console.warn(err);
        toast("수정 중 오류가 발생했습니다.");
      });
      return;
    }

    payload.status = "pending"; payload.submittedById = S.viewerId; payload.submittedByName = S.viewerName||""; payload.submittedAt = nowIso();
    payload.approvedById = null; payload.approvedByName = null; payload.approvedAt = null; payload.rejectReason = null;
    S.db.collection("changes").add(payload).then(function(ref){
      toast("등록되었습니다. 파트장 승인 대기 중입니다.");
      S.formExecItems = []; S.formAttachments = []; S.formEditId = undefined; S.formDraft = null;
      location.hash = "#/item/"+ref.id;
    }).catch(function(err){
      console.warn(err);
      toast("등록 중 오류가 발생했습니다.");
    });
  }

  /* ============ approvals ============ */
  function viewApprovals(){
    var items = S.changes.filter(function(c){ return c.status==="pending"; });
    var head = '<a class="back-link" href="#" data-go-back="1">&larr; 이전으로</a>'
      + '<div class="content-head"><div><h1>승인 대기</h1><div class="meta">'+(S.isPartLeader?"파트장 승인이 필요한 항목입니다.":"파트장만 승인·반려할 수 있어요.")+'</div></div></div>';
    if(!items.length) return head + '<div class="empty">현재 승인 대기 중인 항목이 없습니다.</div>';
    // .map(rowHtml)로 바로 넘기면 Array.map이 두 번째 인자로 배열 인덱스를 넘겨서 그게 hideCat으로 읽혀
    // (0번째=false→칩 표시, 1번째 이후=truthy→칩 숨김) 목록에서 공종 칩이 첫 항목에만 보이는 버그가 있었다.
    return head + '<div class="change-list">'+items.slice().sort(byDateDesc).map(function(c){ return rowHtml(c); }).join("")+'</div>';
  }

  /* ============ settings ============ */
  // 팀원·파트장(또는 관리자)만 "팀 구성"에 오른다 — 새로 가입한 사람과 아직 역할을 안 받은 조회자는
  // 전부 아래 "조회자" 목록에 머물고, 파트장이 거기서 팀원/파트장으로 바꿔줘야 팀 구성으로 올라간다.
  function memberIsTeam(m){ return m.role==="팀원" || m.role==="파트장" || m.isAdmin; }

  function rosterRowHtml(id){
    var m = S.members[id];
    var isMe = id === S.viewerId;
    var isViewer = !memberIsTeam(m);
    var seenLabel = m.firstSeenAt ? (fmtDate(m.firstSeenAt.slice(0,10),"day")+' 첫 방문') : '접속 대기중';
    // 대외비 조회 승인: 조회자(role 미지정)만 해당, 팀원·파트장은 역할 자체로 항상 조회 가능하므로 표시하지 않는다.
    var viewChip = "";
    if(isViewer){
      if(m.viewApproved){
        viewChip = '<span class="chip approved" title="변경 이력을 조회할 수 있어요.">조회 가능</span>';
      } else if(canWrite() && !isMe){
        viewChip = '<button class="btn ghost" type="button" data-approve-view="'+esc(id)+'" style="padding:4px 10px;font-size:11px;" title="이 사람이 변경 이력을 조회할 수 있게 승인해요.">조회 승인</button>';
      } else {
        viewChip = '<span class="chip pending" title="아직 팀원/파트장의 조회 승인을 받지 못했어요.">승인 대기</span>';
      }
    }
    return '<div class="roster-row"><span class="rname">'+(isMe?'<span style="color:var(--accent);">(나) </span>':'')+'<span class="uname" data-uid="'+esc(id)+'">…</span></span>'
      +'<span class="rmeta mono">'+seenLabel+'</span>'
      +viewChip
      +(S.canManageRoster && !isMe ?
        '<div class="seg" data-role-seg="'+esc(id)+'">'
          +'<button data-role="조회자" class="'+(m.role!=="팀원"&&m.role!=="파트장"?"on":"")+'">조회자</button>'
          +'<button data-role="팀원" class="'+(m.role==="팀원"?"on":"")+'">팀원</button>'
          +'<button data-role="파트장" class="'+(m.role==="파트장"?"on":"")+'">파트장</button>'
        +'</div>'
        : '<span class="chip neutral"'+(isMe?' title="본인 역할은 여기서 바꿀 수 없어요. 다른 파트장에게 요청해주세요."':'')+'>'+esc(m.role==="팀원"||m.role==="파트장"?m.role:"조회자")+'</span>')
      +'</div>';
  }

  function viewSettings(){
    var ids = Object.keys(S.members);
    var teamIds = ids.filter(function(id){ return memberIsTeam(S.members[id]); });
    var viewerIds = ids.filter(function(id){ return !memberIsTeam(S.members[id]); });
    var teamRows = teamIds.map(rosterRowHtml).join("");
    var viewerRows = viewerIds.map(rosterRowHtml).join("");

    var viewerSection = '<div class="detail-card" style="margin-top:14px;">'
      +'<h3 style="font-family:var(--font-d);font-size:14px;margin:0 0 10px;">조회자 ('+viewerIds.length+'명)</h3>'
      +(viewerRows || '<div class="empty">새로 가입했거나 아직 팀원·파트장으로 지정되지 않은 사람이 없습니다.</div>')
    +'</div>';

    return '<div class="detail">'
      +'<div class="content-head"><div><h1>설정</h1></div></div>'
      +'<div class="detail-card">'
        +'<h3 style="font-family:var(--font-d);font-size:14px;margin:0 0 10px;">팀 구성 ('+teamIds.length+'명)</h3>'
        +(teamRows || '<div class="empty">아직 등록된 팀원이 없습니다.</div>')
        +'<div style="margin-top:16px;font-size:11.5px;color:var(--ink-faint);line-height:1.6;">역할 변경은 파트장 또는 관리자만, 조회 승인은 팀원 또는 파트장이 할 수 있어요.</div>'
      +'</div>'
      + guidelineDocsSettingsHtml()
      + guidelineHistorySettingsHtml()
      + viewerSection
    +'</div>';
  }

  function guidelineRevisionsFor(major){
    return (S.guidelineRevisions[major] || []).slice().sort(function(a,b){
      return (b.uploadedAt||"").localeCompare(a.uploadedAt||"");
    });
  }

  function guidelineDocsSettingsHtml(){
    var rows = MAJORS.map(function(major){
      var doc = S.guidelineDocs[major];
      var uploading = !!S.gdocUploading[major];
      var pending = S.gdocPending[major];
      var meta = doc
        ? (esc(doc.fileName||"")+' · '+(doc.pageCount||0)+'페이지 · '+esc(doc.uploadedByName||"")+(doc.uploadedAt?' · <b>'+fmtDate(doc.uploadedAt.slice(0,10),"day")+'</b>':''))
        : '아직 업로드되지 않았어요';
      var control = "";
      var pendingHtml = "";
      if(S.canManageRoster){
        if(pending){
          control = '<label class="btn ghost" style="cursor:pointer;">파일 변경'
            +'<input type="file" accept="application/pdf" data-gdoc-upload="'+esc(major)+'"'+(uploading?' disabled':'')+'></label>';
          pendingHtml = '<div class="gdoc-pending-row">'
            +'<span class="gdoc-pending-file">📄 '+esc(pending.file.name)+'</span>'
            +'<input type="date" class="gdoc-date-input" data-gdoc-pending-date="'+esc(major)+'" value="'+esc(pending.date)+'" title="지침서 개정일" '+(uploading?'disabled':'')+'>'
            +'<button class="btn" type="button" data-gdoc-save="'+esc(major)+'" style="padding:5px 12px;font-size:11.5px;"'+(uploading?' disabled':'')+'>'+(uploading?'저장 중…':'저장')+'</button>'
            +'<button class="btn ghost" type="button" data-gdoc-cancel="'+esc(major)+'" style="padding:5px 12px;font-size:11.5px;"'+(uploading?' disabled':'')+'>취소</button>'
          +'</div>';
        } else {
          control = '<label class="btn ghost" style="cursor:pointer;">'+(doc?'교체':'업로드')
            +'<input type="file" accept="application/pdf" data-gdoc-upload="'+esc(major)+'"></label>';
        }
      }
      return '<div class="gdoc-row"><span class="gname">'+esc(major)+'</span><span class="gmeta">'+meta+'</span>'+control+pendingHtml+'</div>';
    }).join("");
    return '<div class="detail-card" style="margin-top:14px;">'
      +'<h3 style="font-family:var(--font-d);font-size:14px;margin:0 0 10px;">실행지침서 (PDF)</h3>'
      + rows
    +'</div>';
  }

  // 업로드/교체 칸이랑 섞여서 복잡해 보이던 변경 이력 조회를 별도 카드로 분리했다.
  function guidelineHistorySettingsHtml(){
    var blocks = MAJORS.map(function(major){
      var revs = guidelineRevisionsFor(major);
      if(!revs.length) return "";
      return '<details class="gdoc-history-block">'
        +'<summary>'+esc(major)+' <span class="gdoc-history-count">('+revs.length+'건)</span></summary>'
        + revs.map(function(r){
            return '<div class="gdoc-history-row"><span class="mono">'+fmtDate((r.uploadedAt||"").slice(0,10),"day")+'판</span><span class="gdoc-history-file">'+esc(r.fileName||"")+'</span><span class="gdoc-history-by">'+esc(r.uploadedByName||"")+'</span>'
              +(S.canManageRoster ? '<button class="gdoc-history-del" type="button" data-gdoc-revdelete="'+esc(r.id)+'" title="이 이력 삭제">✕</button>' : '')
            +'</div>';
          }).join("")
      +'</details>';
    }).join("");
    return '<div class="detail-card" style="margin-top:14px;">'
      +'<h3 style="font-family:var(--font-d);font-size:14px;margin:0 0 10px;">실행지침서 변경 이력</h3>'
      +(blocks || '<div class="empty">아직 이력이 없습니다.</div>')
    +'</div>';
  }

  function setMemberRole(id, role){
    if(!S.db) return Promise.reject();
    return S.db.doc("members/"+id).update({ role: role });
  }

  function approveViewer(id){
    if(!S.db) return;
    S.db.doc("members/"+id).update({ viewApproved: true })
      .then(function(){ toast("조회를 승인했습니다."); })
      .catch(function(err){ console.warn(err); toast("승인 처리 중 오류가 발생했습니다."); });
  }

  function deleteGuidelineRevision(revId){
    if(!S.db){ toast("저장 기능을 사용할 수 없습니다."); return; }
    if(!confirm("이 지침서 변경 이력을 삭제할까요? 되돌릴 수 없어요.")) return;
    S.db.doc("guidelineRevisions/"+revId).delete()
      .then(function(){ toast("이력이 삭제되었습니다."); })
      .catch(function(err){ console.warn(err); toast("삭제 중 오류가 발생했습니다."); });
  }

  function wireSettings(){
    resolveNames();
    document.querySelectorAll("[data-approve-view]").forEach(function(btn){
      btn.addEventListener("click", function(){ approveViewer(btn.getAttribute("data-approve-view")); });
    });
    if(!S.canManageRoster) return;
    document.querySelectorAll("[data-role-seg]").forEach(function(seg){
      var id = seg.getAttribute("data-role-seg");
      seg.querySelectorAll("[data-role]").forEach(function(btn){
        btn.addEventListener("click", function(){
          setMemberRole(id, btn.getAttribute("data-role"))
            .then(function(){ toast("역할이 변경되었습니다."); })
            .catch(function(){ toast("변경 중 오류가 발생했습니다."); });
        });
      });
    });
    document.querySelectorAll("[data-gdoc-upload]").forEach(function(input){
      input.addEventListener("change", function(){
        var major = input.getAttribute("data-gdoc-upload");
        var file = input.files && input.files[0];
        input.value = "";
        if(!file) return;
        if(!/\.pdf$/i.test(file.name)){ toast("PDF 파일만 업로드할 수 있어요."); return; }
        var existing = S.guidelineDocs[major];
        var defaultDate = (existing && existing.uploadedAt) ? existing.uploadedAt.slice(0,10) : nowIso().slice(0,10);
        S.gdocPending[major] = { file: file, date: defaultDate };
        render();
      });
    });
    document.querySelectorAll("[data-gdoc-pending-date]").forEach(function(input){
      input.addEventListener("change", function(){
        var major = input.getAttribute("data-gdoc-pending-date");
        if(S.gdocPending[major]) S.gdocPending[major].date = input.value;
      });
    });
    document.querySelectorAll("[data-gdoc-save]").forEach(function(btn){
      btn.addEventListener("click", function(){
        var major = btn.getAttribute("data-gdoc-save");
        var pending = S.gdocPending[major];
        if(!pending) return;
        uploadGuidelineDoc(major, pending.file, pending.date);
      });
    });
    document.querySelectorAll("[data-gdoc-cancel]").forEach(function(btn){
      btn.addEventListener("click", function(){
        var major = btn.getAttribute("data-gdoc-cancel");
        delete S.gdocPending[major];
        render();
      });
    });
    document.querySelectorAll("[data-gdoc-revdelete]").forEach(function(btn){
      btn.addEventListener("click", function(){
        deleteGuidelineRevision(btn.getAttribute("data-gdoc-revdelete"));
      });
    });
  }

  /* ============ 실행지침서 PDF 검색 ============ */
  // PDF는 pdf.js로 업로드 시점에 페이지별 텍스트를 미리 뽑아 index(=[{page,text}])로 저장해두고,
  // 검색은 그 index를 클라이언트에서 훑는 방식이라 별도 서버/AI 키가 필요없다.
  function extractPdfIndex(arrayBuffer){
    return window.pdfjsLib.getDocument({ data: arrayBuffer }).promise.then(function(pdf){
      var numPages = pdf.numPages;
      var index = [];
      var chain = Promise.resolve();
      var _loop = function(pageNum){
        chain = chain.then(function(){
          return pdf.getPage(pageNum).then(function(page){
            return page.getTextContent().then(function(tc){
              var text = tc.items.map(function(it){ return it.str; }).join(" ").replace(/\s+/g," ").trim();
              index.push({ page: pageNum, text: text });
            });
          });
        });
      };
      for(var n=1;n<=numPages;n++){ _loop(n); }
      return chain.then(function(){ return { pageCount: numPages, index: index }; });
    });
  }

  // 문서 하나(특히 200페이지 안팎의 건축 지침서)의 페이지별 텍스트를 통째로 문서 1개에 넣으면
  // db 문서 1개당 용량 제한을 넘을 수 있어서, 페이지들을 용량 기준으로 여러 조각(chunk)으로 나눠
  // guidelineChunks 컬렉션에 나눠 저장하고 읽을 때 다시 합친다.
  function byteLen(s){
    if(typeof TextEncoder !== "undefined"){ return new TextEncoder().encode(s).length; }
    var n = 0;
    for(var i=0;i<s.length;i++){ n += s.charCodeAt(i) > 127 ? 3 : 1; }
    return n;
  }
  function chunkPagesByBudget(pages, budgetBytes){
    var chunks = []; var cur = []; var curBytes = 40;
    pages.forEach(function(pg){
      var entryBytes = byteLen(pg.text||"") + 24;
      if(cur.length && curBytes + entryBytes > budgetBytes){
        chunks.push(cur); cur = []; curBytes = 40;
      }
      cur.push(pg); curBytes += entryBytes;
    });
    if(cur.length) chunks.push(cur);
    return chunks;
  }
  function guidelinePagesFor(major){
    var docId = MAJOR_ID[major] || major;
    var chunks = S.guidelineChunksByDoc[docId] || [];
    var pages = [];
    chunks.forEach(function(arr){ if(arr) pages = pages.concat(arr); });
    return pages;
  }

  function guidelineHasAnyDocs(){
    return MAJORS.some(function(m){ return guidelinePagesFor(m).length > 0; });
  }

  /* ============ 지침서 개정 기준선 (guideline revision baseline) ============
     지침서는 반기에 한 번 정도만 개정되고, 이 사이트는 그때마다 다시 배포할 수 없어서,
     "최신 지침서가 언제 개정됐는지"를 기준선으로 삼아 그 이후 쌓인 변경사항을 구분해서 보여준다. */
  function guidelineBaselineDate(major){
    var doc = S.guidelineDocs[major];
    return (doc && doc.uploadedAt) ? doc.uploadedAt.slice(0,10) : null;
  }
  function guidelineBaselineBannerHtml(monthYm){
    if(monthYm) return "";
    if(S.filters.department) return ""; // 부서별 조회 화면에서는 안 보여준다 (부제목과 함께 정리).
    var majorsToShow = S.filters.major ? [S.filters.major] : MAJORS;
    var chips = majorsToShow.map(function(m){
      var base = guidelineBaselineDate(m);
      if(!base) return null;
      return '<span class="chip gbase-chip">'+esc(m)+' '+fmtDate(base,"day")+' 개정</span>';
    }).filter(Boolean);
    if(!chips.length) return "";
    return '<div class="gbase-row"><span class="gbase-label">실행지침서 최신 개정 기준선</span>'+chips.join(" ")+'</div>';
  }

  function uploadGuidelineDoc(major, file, revisionDate){
    if(!S.db){ toast("저장 기능을 사용할 수 없습니다."); return; }
    if(!window.pdfjsLib){ toast("PDF 처리 기능을 사용할 수 없습니다."); return; }
    if(!/\.pdf$/i.test(file.name)){ toast("PDF 파일만 업로드할 수 있어요."); return; }
    // 개정일을 직접 지정하면 그 날짜를, 비워두면 업로드 시각을 기준선으로 사용한다.
    var uploadedAt = (revisionDate && /^\d{4}-\d{2}-\d{2}$/.test(revisionDate)) ? (revisionDate+"T00:00:00.000Z") : nowIso();
    var docId = MAJOR_ID[major] || major;
    var prevChunkCount = (S.guidelineDocs[major] && S.guidelineDocs[major].chunkCount) || 0;
    S.gdocUploading[major] = true; render();
    toast(major+" 지침서를 분석하는 중… (페이지가 많으면 시간이 좀 걸려요)");
    var extracted;
    readFileArrayBuffer(file).then(function(buf){
      return extractPdfIndex(buf);
    }).then(function(res){
      extracted = res;
      // Supabase Storage 키는 한글 등 비-ASCII 문자를 포함하면 "InvalidKey" 오류로 거부된다.
      // encodeURIComponent로 미리 퍼센트 인코딩해도, 서버가 URL을 디코딩하는 과정에서 결국
      // 다시 한글(비-ASCII)로 돌아와 똑같이 거부되므로, 대공종 한글명 대신 항상 영문 id(docId)만 사용한다.
      var path = "guideline_"+docId+"_"+Date.now()+".pdf";
      if(S.assets){
        return S.assets.upload(file, {type:"application/pdf"}).then(function(r){ return r.url; });
      }
      return S.sb.storage.from("guidelines").upload(path, file, { contentType:"application/pdf", upsert:true }).then(function(r){
        if(r.error) throw r.error;
        return S.sb.storage.from("guidelines").getPublicUrl(path).data.publicUrl;
      });
    }).then(function(url){
      var chunks = chunkPagesByBudget(extracted.index, 180000);
      // guideline_chunks.doc_id는 guideline_docs.id를 참조하는 외래키라서, chunk를 쓰기 전에
      // guideline_docs 행을 먼저 만들어둬야 한다. 순서가 반대면(예전 코드처럼 chunk를 먼저 쓰면)
      // 그 대공종을 처음 업로드할 때(아직 guideline_docs 행이 없을 때) "Key is not present in table
      // guideline_docs" 외래키 위반(23503) 오류로 업로드가 실패한다.
      return S.db.doc("guidelineDocs/"+docId).set({
        major: major, fileName: file.name, url: url, pageCount: extracted.pageCount, chunkCount: chunks.length,
        uploadedById: S.viewerId, uploadedByName: S.viewerName||"", uploadedAt: uploadedAt
      }).then(function(){
        var writes = chunks.map(function(pages, i){
          return S.db.doc("guidelineChunks/"+docId+"_"+i).set({ docId: docId, chunkIndex: i, pages: pages });
        });
        return Promise.all(writes);
      }).then(function(){
        var cleanups = [];
        for(var i=chunks.length; i<prevChunkCount; i++){
          cleanups.push(S.db.doc("guidelineChunks/"+docId+"_"+i).delete().catch(function(){}));
        }
        return Promise.all(cleanups);
      }).then(function(){
        // 업로드할 때마다 별도의 이력 레코드도 남겨서, 나중에 "몇 번 개정됐는지" / "어떤 판이 있었는지"를
        // 설정 페이지에서 확인하고, 현장별로 과거 판을 선택해서 기록할 수 있게 한다.
        var revId = docId+"_r"+Date.now();
        return S.db.doc("guidelineRevisions/"+revId).set({
          docId: docId, major: major, fileName: file.name, url: url, pageCount: extracted.pageCount,
          uploadedById: S.viewerId, uploadedByName: S.viewerName||"", uploadedAt: uploadedAt, createdAt: nowIso()
        }).catch(function(err){
          console.warn("guideline revision write failed", err);
          toast("지침서는 반영됐지만, 변경 이력 저장에는 실패했어요.");
        });
      });
    }).then(function(){
      S.gdocUploading[major] = false;
      delete S.gdocPending[major];
      toast(major+" 지침서가 업데이트되었습니다 ("+extracted.pageCount+"페이지).");
      render();
    }).catch(function(err){
      console.warn(err);
      S.gdocUploading[major] = false;
      toast(major+" 지침서 업로드 중 오류가 발생했습니다.");
      render();
    });
  }

  function docsearchRun(q){
    q = (q||"").trim();
    if(!q){ S.docsearchResults = []; return; }
    var tokens = q.toLowerCase().split(/\s+/).filter(Boolean);
    var results = [];
    MAJORS.forEach(function(major){
      var pages = guidelinePagesFor(major);
      pages.forEach(function(pg){
        var hay = (pg.text||"").toLowerCase();
        var allMatch = tokens.every(function(t){ return hay.indexOf(t) !== -1; });
        if(!allMatch) return;
        var score = 0;
        tokens.forEach(function(t){
          var idx = 0;
          while(true){ idx = hay.indexOf(t, idx); if(idx===-1) break; score++; idx += t.length; }
        });
        results.push({ major: major, page: pg.page, text: pg.text, score: score });
      });
    });
    results.sort(function(a,b){ return b.score - a.score || a.major.localeCompare(b.major,"ko") || a.page-b.page; });
    S.docsearchResults = results.slice(0, 60);
  }

  function docsearchSnippet(text, tokens){
    var hay = text.toLowerCase();
    var firstIdx = -1;
    tokens.forEach(function(t){
      var idx = hay.indexOf(t);
      if(idx!==-1 && (firstIdx===-1 || idx<firstIdx)) firstIdx = idx;
    });
    if(firstIdx===-1) firstIdx = 0;
    var start = Math.max(0, firstIdx - 40);
    var end = Math.min(text.length, firstIdx + 140);
    var snippet = (start>0?"…":"") + text.slice(start,end) + (end<text.length?"…":"");
    var escaped = esc(snippet);
    tokens.forEach(function(t){
      if(!t) return;
      var re = new RegExp("("+t.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")+")","gi");
      escaped = escaped.replace(re, "<mark>$1</mark>");
    });
    return escaped;
  }

  function docsearchResultsHtml(){
    if(!guidelineHasAnyDocs()){
      return '<div class="docsearch-empty">아직 등록된 실행지침서가 없어요.'+(S.canManageRoster?' 설정 페이지에서 PDF를 업로드해주세요.':' 파트장에게 설정 페이지에서 업로드를 요청해주세요.')+'</div>';
    }
    if(!S.docsearchQuery.trim()){
      var chips = MAJORS.filter(function(m){ return S.guidelineDocs[m]; }).map(function(m){
        return '<span class="chip neutral">'+esc(m)+' '+(S.guidelineDocs[m].pageCount||0)+'p</span>';
      }).join("");
      return '<div class="docsearch-empty">지침서 내용을 검색해보세요.<div class="docsearch-doclist">'+chips+'</div></div>';
    }
    if(!S.docsearchResults.length){
      return '<div class="docsearch-empty">"'+esc(S.docsearchQuery)+'"에 대한 검색 결과가 없어요.</div>';
    }
    var tokens = S.docsearchQuery.toLowerCase().split(/\s+/).filter(Boolean);
    var html = '<div class="docsearch-count">'+S.docsearchResults.length+'건</div>';
    html += S.docsearchResults.map(function(r,i){
      return '<button class="docsearch-result" type="button" data-open-doc="'+i+'">'
        +'<div class="rmeta"><span class="rdoc">'+esc(r.major)+'</span><span class="rpage">'+r.page+'페이지</span></div>'
        +'<div class="rsnippet">'+docsearchSnippet(r.text, tokens)+'</div>'
      +'</button>';
    }).join("");
    return html;
  }

  function docsearchPanelHtml(){
    var body;
    if(S.docsearchViewer) body = docsearchViewerHtml();
    else body = '<div class="docsearch-searchbar"><input id="docsearchInput" type="text" placeholder="예: 에폭시, 주차장 바닥" value="'+esc(S.docsearchQuery)+'"></div>'
      +'<div class="docsearch-body" id="docsearchBody">'+docsearchResultsHtml()+'</div>';
    return '<div class="docsearch-panel">'
      +'<div class="docsearch-head"><span class="t">✦ 지침서 검색</span><button class="icon-btn" id="docsearchCloseBtn" aria-label="닫기" style="width:26px;height:26px;">✕</button></div>'
      + body
    +'</div>';
  }

  function docsearchViewerHtml(){
    var v = S.docsearchViewer;
    var doc = S.guidelineDocs[v.major];
    var title = v.major + ' · ' + v.page + '/' + (doc?doc.pageCount:'?') + '페이지';
    return '<div class="docsearch-viewer">'
      +'<div class="docsearch-viewer-head"><button class="back" id="docsearchBackBtn" type="button">&larr; 검색결과</button><span class="vt">'+esc(title)+'</span>'
        +(doc && doc.url ? '<a class="docsearch-viewer-openlink" href="'+doc.url+'#page='+v.page+'" target="_blank" rel="noopener">새 창 ↗</a>' : '')
      +'</div>'
      +'<div class="docsearch-viewer-nav">'
        +'<button class="icon-btn" id="docsearchPrevBtn" style="width:26px;height:26px;" aria-label="이전 페이지"'+(v.page<=1?' disabled':'')+'>&larr;</button>'
        +'<span class="pg mono">'+v.page+' / '+(doc?doc.pageCount:'?')+'</span>'
        +'<button class="icon-btn" id="docsearchNextBtn" style="width:26px;height:26px;" aria-label="다음 페이지"'+(doc&&v.page>=doc.pageCount?' disabled':'')+'>&rarr;</button>'
      +'</div>'
      +'<div class="docsearch-viewport" id="docsearchZoomScroll"><div class="docsearch-viewer-host" id="docsearchViewerHost"><div style="padding:14px;font-size:12px;color:var(--ink-faint);">불러오는 중…</div></div></div>'
      +zoomWidgetHtml("docsearch")
    +'</div>';
  }

  function getPdfDocProxy(major, url){
    if(!S.pdfCache[major]){
      S.pdfCache[major] = window.pdfjsLib.getDocument(url).promise;
    }
    return S.pdfCache[major];
  }

  // 지침서 PDF는 위아래·좌우 여백이 넓어서 그대로 렌더링하면 실제 내용(표 등)이 작게 보인다.
  // 돋보기로 확대해서 보는 대신, 렌더링된 캔버스에서 거의 흰색인 여백을 찾아 잘라내
  // 내용만 화면 너비에 꽉 차게 보이도록 한다. 픽셀 전체를 훑으면 느리므로, 작은 축소본에서
  // 여백 경계를 찾은 뒤 원본 해상도 좌표로 환산해서 잘라낸다.
  function cropCanvasToContent(canvas){
    var W = canvas.width, H = canvas.height;
    if(!W || !H) return canvas;
    var sampleW = 240;
    var sampleH = Math.max(1, Math.round(H * (sampleW / W)));
    var sc = document.createElement("canvas");
    sc.width = sampleW; sc.height = sampleH;
    var sctx = sc.getContext("2d");
    sctx.drawImage(canvas, 0, 0, sampleW, sampleH);
    var data;
    try{ data = sctx.getImageData(0, 0, sampleW, sampleH).data; }catch(e){ return canvas; }
    var minX = sampleW, minY = sampleH, maxX = 0, maxY = 0, found = false;
    var threshold = 248; // 이보다 어두운 픽셀이 있으면 "내용"으로 간주 (거의 흰색은 여백)
    for(var y=0; y<sampleH; y++){
      for(var x=0; x<sampleW; x++){
        var idx = (y*sampleW+x)*4;
        if(data[idx] < threshold || data[idx+1] < threshold || data[idx+2] < threshold){
          found = true;
          if(x < minX) minX = x;
          if(x > maxX) maxX = x;
          if(y < minY) minY = y;
          if(y > maxY) maxY = y;
        }
      }
    }
    if(!found) return canvas;
    var sx = W / sampleW, sy = H / sampleH;
    var padX = Math.round((maxX-minX+1) * sx * 0.02) + 6;
    var padY = Math.round((maxY-minY+1) * sy * 0.02) + 6;
    var cx0 = Math.max(0, Math.round(minX*sx) - padX);
    var cy0 = Math.max(0, Math.round(minY*sy) - padY);
    var cx1 = Math.min(W, Math.round((maxX+1)*sx) + padX);
    var cy1 = Math.min(H, Math.round((maxY+1)*sy) + padY);
    var cw = cx1-cx0, ch = cy1-cy0;
    if(cw <= 0 || ch <= 0) return canvas;
    var out = document.createElement("canvas");
    out.width = cw; out.height = ch;
    out.getContext("2d").drawImage(canvas, cx0, cy0, cw, ch, 0, 0, cw, ch);
    return out;
  }

  function renderSinglePdfPage(container, major, url, pageNum){
    if(!window.pdfjsLib){ container.innerHTML = '<div style="padding:14px;font-size:12px;color:var(--ink-faint);">PDF 미리보기를 사용할 수 없습니다.</div>'; return; }
    getPdfDocProxy(major, url).then(function(pdf){
      return pdf.getPage(pageNum);
    }).then(function(page){
      if(!document.body.contains(container)) return;
      var hostWidth = container.clientWidth || 300;
      var baseViewport = page.getViewport({ scale: 1 });
      var fitScale = hostWidth / baseViewport.width;
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      // 여백을 잘라내고 나면 남은 내용이 화면 너비에 맞춰 더 확대되어 보이므로,
      // 그만큼 더 촘촘한 해상도로 렌더링해둬야 잘라낸 뒤에도 흐려 보이지 않는다.
      var scale = Math.min(7, fitScale * dpr * 3);
      var viewport = page.getViewport({ scale: scale });
      var canvas = document.createElement("canvas");
      canvas.width = viewport.width; canvas.height = viewport.height;
      var ctx = canvas.getContext("2d");
      return page.render({ canvasContext: ctx, viewport: viewport }).promise.then(function(){
        if(!document.body.contains(container)) return;
        var shown = cropCanvasToContent(canvas);
        container.innerHTML = "";
        container.appendChild(shown);
        // 잘라낸 뒤에도 세부 내용을 더 자세히 보고 싶을 수 있어 +/- 버튼이나 Ctrl+휠로 확대할 수 있게 한다.
        try{ wireZoomWidget("docsearch", container.parentElement, container, true); }catch(e){}
      });
    }).catch(function(err){
      console.warn("guideline pdf render failed", err);
      if(document.body.contains(container)){
        container.innerHTML = '<div style="padding:14px;font-size:12px;color:var(--ink-faint);">PDF를 불러오지 못했습니다.</div>';
      }
    });
  }

  function openDocsearchPage(major, page){
    var doc = S.guidelineDocs[major];
    if(!doc) return;
    page = Math.max(1, Math.min(doc.pageCount||page, page));
    S.docsearchViewer = { major: major, page: page };
    render();
  }

  function wireDocsearchResults(){
    document.querySelectorAll("[data-open-doc]").forEach(function(btn){
      btn.addEventListener("click", function(){
        var r = S.docsearchResults[+btn.getAttribute("data-open-doc")];
        if(r) openDocsearchPage(r.major, r.page);
      });
    });
  }

  function wireDocsearchPanel(){
    var closeBtn = document.getElementById("docsearchCloseBtn");
    if(closeBtn) closeBtn.addEventListener("click", function(){
      S.docsearchOpen = false;
      try{ localStorage.setItem("lynn_docsearchOpen","0"); }catch(e){}
      render();
    });
    if(S.docsearchViewer){
      var backBtn = document.getElementById("docsearchBackBtn");
      if(backBtn) backBtn.addEventListener("click", function(){ S.docsearchViewer = null; render(); });
      var prevBtn = document.getElementById("docsearchPrevBtn");
      if(prevBtn) prevBtn.addEventListener("click", function(){ openDocsearchPage(S.docsearchViewer.major, S.docsearchViewer.page-1); });
      var nextBtn = document.getElementById("docsearchNextBtn");
      if(nextBtn) nextBtn.addEventListener("click", function(){ openDocsearchPage(S.docsearchViewer.major, S.docsearchViewer.page+1); });
      var host = document.getElementById("docsearchViewerHost");
      var doc = S.guidelineDocs[S.docsearchViewer.major];
      if(host && doc && doc.url) renderSinglePdfPage(host, S.docsearchViewer.major, doc.url, S.docsearchViewer.page);
      return;
    }
    var input = document.getElementById("docsearchInput");
    if(input){
      input.addEventListener("input", function(){
        S.docsearchQuery = input.value;
        docsearchRun(S.docsearchQuery);
        var bodyEl = document.getElementById("docsearchBody");
        if(bodyEl){ bodyEl.innerHTML = docsearchResultsHtml(); wireDocsearchResults(); }
      });
    }
    wireDocsearchResults();
  }

  /* ============ site compliance (현장별 실행 반영 체크) ============ */
  function siteRelevantChanges(s){
    var approved = S.changes.filter(function(c){ return c.status==="approved"; });
    if(!s.deadline) return { before: approved, after: [] };
    var before = approved.filter(function(c){ return (c.changeDate||"") <= s.deadline; });
    var after = approved.filter(function(c){ return (c.changeDate||"") > s.deadline; });
    return { before: before, after: after };
  }
  function siteApplyStats(s){
    var rel = siteRelevantChanges(s);
    var map = s.appliedMap || {};
    var applied = rel.before.filter(function(c){ return !!map[c.id]; }).length;
    return { applied: applied, total: rel.before.length, afterCount: rel.after.length };
  }

  /* ============ 현장별 "어느 시점 지침서가 반영됐는지" 표시 ============
     지침서 개정일(guideline_docs.uploaded_at)을 그 현장에 스탬프로 기록해두면,
     나중에 지침서가 또 개정됐을 때 이 현장이 최신 지침서를 따라가고 있는지 바로 알 수 있다. */
  function siteGuidelineOverallStatus(s){
    var applied = s.appliedGuidelines || {};
    var recorded = MAJORS.filter(function(m){ return !!applied[m]; });
    if(!recorded.length) return "unset";
    var stale = recorded.some(function(m){
      var base = guidelineBaselineDate(m);
      return base && applied[m].slice(0,10) < base;
    });
    return stale ? "stale" : "current";
  }
  function siteGuidelineStatusHtml(s){
    var applied = s.appliedGuidelines || {};
    return MAJORS.map(function(m){
      var doc = S.guidelineDocs[m];
      if(!doc) return "";
      var at = applied[m];
      if(!at) return '<span class="chip neutral">'+esc(m)+' 미기록</span>';
      var base = guidelineBaselineDate(m);
      var stale = base && at.slice(0,10) < base;
      return '<span class="chip '+(stale?"pending":"approved")+'" title="'+(stale?'이후 지침서가 개정됐어요 (최신 '+esc(base)+')':'최신 지침서 기준')+'">'+esc(m)+' '+fmtDate(at.slice(0,10),"day")+'판'+(stale?' · 구버전':'')+'</span>';
    }).join("");
  }
  // 현장별로 어느 판(개정일)의 지침서가 반영됐는지, 과거 변경 이력 중에서 직접 골라 기록할 수 있게 한다.
  // "공통가설 26.08.18 판 / 건축 26.09.21판 / 현장관리비 26.09.21판" 처럼 한 줄에 들어오도록
  // 공종마다 칩 대신 짧은 라벨 + 드롭다운으로 구성하고, 옵션에서도 파일명은 빼고 판(날짜)만 보여준다.
  function siteGuidelineControlsHtml(appliedGuidelines, editable){
    var applied = appliedGuidelines || {};
    var items = MAJORS.map(function(m){
      var doc = S.guidelineDocs[m];
      if(!doc) return null;
      var revs = guidelineRevisionsFor(m);
      if(!revs.length && doc.uploadedAt){
        revs = [{ uploadedAt: doc.uploadedAt, fileName: doc.fileName }];
      }
      var at = applied[m];
      var base = guidelineBaselineDate(m);
      var stale = !!(at && base && at.slice(0,10) < base);
      var statusClass = !at ? "neutral" : (stale ? "pending" : "approved");
      var options = '<option value=""'+(!at?' selected':'')+'>미기록</option>' + revs.map(function(r){
        var d = (r.uploadedAt||"").slice(0,10);
        var sel = (at && at.slice(0,10)===d) ? ' selected' : '';
        return '<option value="'+esc(r.uploadedAt)+'"'+sel+' title="'+esc(r.fileName||"")+'">'+fmtDate(d,"day")+'판</option>';
      }).join("");
      var hint = stale ? ' title="최신 지침서가 개정됐어요 (최신 '+esc(base)+')"' : '';
      return '<span class="gapply-item gs-'+statusClass+'"'+hint+'><b class="gapply-mname">'+esc(m)+'</b>'
        +'<select class="gapply-select" data-gapply-major="'+esc(m)+'"'+(editable?'':' disabled')+'>'+options+'</select>'
      +'</span>';
    }).filter(Boolean);
    return items.join("");
  }
  // 아래 3개 함수는 더 이상 DB에 바로 쓰지 않고, 화면 하단 통합 "저장" 버튼을 누르기 전까지는
  // S.siteDraft(초안)만 바꾼다 — 실제 반영은 saveSiteAll()에서 한번에 처리한다.
  function stampSiteGuideline(siteId){
    if(!S.siteDraft) return;
    var applied = {};
    MAJORS.forEach(function(m){
      var doc = S.guidelineDocs[m];
      if(doc && doc.uploadedAt) applied[m] = doc.uploadedAt;
    });
    if(!Object.keys(applied).length){ toast("아직 등록된 지침서가 없어요."); return; }
    S.siteDraft.appliedGuidelines = applied;
    toast("현재 지침서 기준으로 채웠습니다. 저장 버튼을 눌러야 반영돼요.");
    render();
  }
  function stampSiteGuidelineMajor(siteId, major, uploadedAt){
    if(!S.siteDraft) return;
    var applied = Object.assign({}, S.siteDraft.appliedGuidelines || {});
    if(uploadedAt) applied[major] = uploadedAt; else delete applied[major];
    S.siteDraft.appliedGuidelines = applied;
    render();
  }
  function setSiteManager(siteId, memberId){
    if(!S.siteDraft) return;
    S.siteDraft.managerId = memberId || "";
    render();
  }
  function saveSiteAll(id){
    if(!S.db){ toast("저장 기능을 사용할 수 없습니다."); return; }
    var draft = S.siteDraft;
    if(!draft) return;
    var managerName = draft.managerId ? ((S.members[draft.managerId] && S.members[draft.managerId].name) || "") : "";
    // manager_id는 uuid 컬럼이라 "미지정" 상태(draft.managerId==="")일 땐 빈 문자열이 아니라 null로 보내야 한다.
    S.db.doc("sites/"+id).update({
      deadline: draft.deadline||"",
      managerId: draft.managerId||null,
      managerName: managerName,
      appliedGuidelines: draft.appliedGuidelines||{},
      appliedMap: draft.appliedMap||{},
      updatedById:S.viewerId, updatedByName:S.viewerName||"", updatedAt: nowIso()
    }).then(function(){
      toast("저장되었습니다.");
      S.siteDraft = null; // 다음 렌더링 때 방금 저장된 값으로 초안을 다시 초기화
      render();
    }).catch(function(err){ console.warn(err); toast("저장 중 오류가 발생했습니다."); });
  }

  function viewDeptPicker(){
    var head = '<div class="content-head"><div><h1>부서별 조회</h1>'
      +'<div class="meta">유관부서별로 등록된 실행 편성 기준 변경 이력을 모아볼 수 있어요.</div></div></div>';
    var rows = DEPARTMENTS.map(function(d){
      var cnt = S.changes.filter(function(c){ return (c.department||DEFAULT_DEPARTMENT) === d; }).length;
      return '<button class="row" data-open-dept="'+encodeURIComponent(d)+'">'
        +'<div class="rowmain"><div class="rowtitle">'+esc(d)+'</div></div>'
        +'<span class="chip neutral">'+cnt+'건</span>'
      +'</button>';
    }).join("");
    return head + '<div class="change-list list-roomy">'+rows+'</div>';
  }
  function wireDeptPicker(){
    document.querySelectorAll("[data-open-dept]").forEach(function(el){
      el.addEventListener("click", function(){ location.hash = "#/dept/"+el.getAttribute("data-open-dept"); });
    });
  }

  function viewSites(){
    var head = '<div class="content-head"><div><h1>현장별 실행 반영 현황</h1>'
      +'<div class="meta">현장에 실행 마감일을 설정하면, 마감일 이전 기준은 체크리스트로 반영 여부를 관리하고 마감일 이후 새로 생긴 기준은 따로 모아 보여줘요.</div></div></div>';

    var addBlock = "";
    if(canWrite()){
      addBlock = '<div class="site-add-row">'
        +'<input id="s-name" type="text" placeholder="현장명 (예: 고양창릉)">'
        +'<input id="s-deadline" type="date" aria-label="실행 마감일 (선택)">'
        +'<button class="btn" id="addSiteBtn" type="button">현장 추가</button>'
      +'</div>';
    }

    var sortedSites = S.sites.slice().sort(function(a,b){
      var da = a.deadline||"", db = b.deadline||"";
      if(!da && !db) return (a.name||"").localeCompare(b.name||"","ko");
      if(!da) return 1;
      if(!db) return -1;
      if(da === db) return (a.name||"").localeCompare(b.name||"","ko");
      return da > db ? -1 : 1;
    });
    var canDeleteSite = S.isPartLeader || S.isOwner;
    var rows = sortedSites.map(function(s){
      var stat = siteApplyStats(s);
      var remain = stat.total - stat.applied;
      var precision = (s.deadline||"").length===7 ? "month" : "day";
      return '<div class="row-wrap">'
        +'<button class="row" data-open-site="'+s.id+'">'
          +'<span class="rowdate mono">'+(s.deadline ? fmtDate(s.deadline, precision) : "마감일 미설정")+'</span>'
          +'<div class="rowmain"><div class="rowtitle">'+esc(s.name)+'</div></div>'
          +(stat.afterCount>0 ? '<span class="chip neutral">마감 후 '+stat.afterCount+'건</span>' : '')
          +(remain>0 ? '<span class="chip pending">미반영 '+remain+'건</span>' : '<span class="chip approved">모두 반영</span>')
        +'</button>'
        +(canDeleteSite ? '<button class="row-del" type="button" data-delete-site="'+s.id+'" title="현장 삭제">✕</button>' : '')
      +'</div>';
    }).join("");
    var listPart = rows ? '<div class="change-list list-roomy">'+rows+'</div>' : '<div class="empty">등록된 현장이 없습니다. 위에서 현장을 추가해보세요.</div>';

    return head + addBlock + listPart;
  }

  function wireSites(){
    document.querySelectorAll("[data-open-site]").forEach(function(el){
      el.addEventListener("click", function(){ location.hash = "#/sites/"+el.getAttribute("data-open-site"); });
    });
    var addBtn = document.getElementById("addSiteBtn");
    if(addBtn) addBtn.addEventListener("click", function(){
      var name = document.getElementById("s-name").value.trim();
      var deadline = document.getElementById("s-deadline").value;
      if(!name){ toast("현장명을 입력해주세요."); return; }
      if(!S.db){ toast("저장 기능을 사용할 수 없습니다."); return; }
      S.db.collection("sites").add({
        name: name, deadline: deadline||"", appliedMap: {}, checklistStatus:"draft",
        updatedById: S.viewerId, updatedByName: S.viewerName||"", updatedAt: nowIso()
      }).then(function(ref){
        toast("현장이 추가되었습니다.");
        location.hash = "#/sites/"+ref.id;
      }).catch(function(err){ console.warn(err); toast("추가 중 오류가 발생했습니다."); });
    });
    document.querySelectorAll("[data-delete-site]").forEach(function(btn){
      btn.addEventListener("click", function(e){
        e.stopPropagation();
        var id = btn.getAttribute("data-delete-site");
        var s = S.sites.find(function(x){ return x.id===id; });
        if(!confirm('"'+((s&&s.name)||"이 현장")+'"을(를) 삭제할까요? 체크리스트 반영 내역도 함께 사라지고, 되돌릴 수 없어요.')) return;
        if(!S.db){ toast("삭제 기능을 사용할 수 없습니다."); return; }
        S.db.doc("sites/"+id).delete().then(function(){
          S.sites = S.sites.filter(function(x){ return x.id!==id; });
          toast("현장을 삭제했습니다.");
          render();
        }).catch(function(err){ console.warn(err); toast("삭제 중 오류가 발생했습니다."); });
      });
    });
  }

  function siteChecklistLocked(s){
    var st = s.checklistStatus || "draft";
    return st === "pending_approval" || st === "approved";
  }

  function siteCheckRowHtml(c, applied, locked, showCheckbox){
    var precision = (c.changeDate||"").length===7 ? "month" : "day";
    return '<div class="row check-row'+(applied?' applied':'')+(showCheckbox?'':' no-check')+'">'
      +(showCheckbox ? '<input type="checkbox" class="apply-check" data-apply-toggle="'+c.id+'"'+(applied?' checked':'')+(locked?' disabled':'')+' aria-label="이 현장에 반영됨">' : '')
      +'<span class="rowdate mono">'+fmtDate(c.changeDate, precision)+'</span>'
      +urgencyChip(c.urgency)
      +'<span class="rowmain" data-open="'+c.id+'"><span class="rowtitle">'+esc(c.title)+'</span></span>'
    +'</div>';
  }

  function groupedChecklistHtml(list, appliedMap, locked, showCheckbox){
    var byMajor = {};
    list.forEach(function(c){ (byMajor[c.major]=byMajor[c.major]||[]).push(c); });
    var html = "";
    MAJORS.forEach(function(maj){
      var arr = byMajor[maj]; if(!arr || !arr.length) return;
      html += '<div class="section-title" style="--dot:'+MAJOR_COLOR[maj]+';"><span class="dot"></span>'+esc(maj)+'</div><div class="change-list">'
        +arr.slice().sort(byDateDesc).map(function(c){ return siteCheckRowHtml(c, !!appliedMap[c.id], locked, showCheckbox); }).join("")
      +'</div>';
    });
    return html;
  }

  function statsForList(list, appliedMap){
    var applied = list.filter(function(c){ return !!appliedMap[c.id]; }).length;
    return { applied: applied, total: list.length };
  }

  function viewSiteDetail(id){
    var s = S.sites.find(function(x){ return x.id===id; });
    if(!s) return '<div class="detail"><div class="empty">현장을 찾을 수 없습니다.</div></div>';
    if(S.siteDetailId !== id){ S.siteDetailId = id; S.siteViewMode = "checklist"; S.siteDraft = null; }
    // 실행마감일/담당자/지침서시점/체크리스트는 전부 이 초안(draft)에만 반영되고,
    // 통합 저장 버튼을 눌러야 실제로 DB에 저장된다.
    if(!S.siteDraft){
      S.siteDraft = {
        deadline: s.deadline || "",
        managerId: s.managerId || "",
        appliedGuidelines: Object.assign({}, s.appliedGuidelines || {}),
        appliedMap: Object.assign({}, s.appliedMap || {})
      };
    }
    var draft = S.siteDraft;
    var draftSite = Object.assign({}, s, { deadline: draft.deadline });
    var appliedMap = draft.appliedMap || {};
    var rel = siteRelevantChanges(draftSite);
    var deadlinePrecision = (draft.deadline||"").length===7 ? "month" : "day";
    var status = s.checklistStatus || "draft";
    var locked = siteChecklistLocked(s);
    var deadlineEditable = !locked && canWrite();

    // 상단 액션 영역: 저장/승인요청/승인/승인요청 취소/승인완료 취소 버튼은 전부 마감일/담당자 박스
    // 안, 오른쪽에 들어간다. 승인 대기중/승인됨 상태 표시(칩)만 박스 바로 위, 오른쪽 끝에 따로 둔다.
    var saveHtml = canWrite() ? '<button class="btn ghost" id="saveSiteAll" type="button">저장</button>' : "";
    var actionHtml = "";
    var statusRowHtml = "";
    if(status === "draft"){
      actionHtml = saveHtml + (canWrite() ? '<button class="btn" id="btnRequestSiteApproval" type="button">승인요청</button>' : "");
    } else if(status === "pending_approval"){
      statusRowHtml = '<span class="chip pending">승인 대기중</span>';
      if(S.isPartLeader){
        actionHtml = '<button class="btn" id="btnApproveSite" type="button">승인</button>';
      } else if(canWrite()){
        actionHtml = '<button class="btn ghost" id="btnCancelSiteRequest" type="button">승인요청 취소</button>';
      }
    } else if(status === "approved"){
      statusRowHtml = '<span class="chip approved">승인됨</span>';
      if(S.isPartLeader || S.isOwner){
        actionHtml = '<button class="btn ghost" id="btnUndoSiteApproval" type="button">승인완료 취소</button>';
      }
    }

    var managerOptions = '<option value="">미지정</option>' + Object.keys(S.members).map(function(mid){
      return { id: mid, name: (S.members[mid].name || "이름 비공개") };
    }).sort(function(a,b){ return a.name.localeCompare(b.name,"ko"); }).map(function(x){
      return '<option value="'+esc(x.id)+'"'+(draft.managerId===x.id?' selected':'')+'>'+esc(x.name)+'</option>';
    }).join("");

    var controlCard = (statusRowHtml ? '<div class="site-status-row">'+statusRowHtml+'</div>' : '')
      + '<div class="detail-card site-control-row">'
        +'<label for="s-deadline-edit">실행 마감일</label>'
        +'<input id="s-deadline-edit" type="date" value="'+esc(draft.deadline||"")+'"'+(deadlineEditable?'':' disabled')+'>'
        +'<label for="s-manager-edit" class="field-sep">담당자</label>'
        +'<select id="s-manager-edit"'+(deadlineEditable?'':' disabled')+'>'+managerOptions+'</select>'
        +(actionHtml ? '<span class="site-actions">'+actionHtml+'</span>' : '')
      +'</div>';

    var guidelineCard = "";
    if(guidelineHasAnyDocs()){
      guidelineCard = '<h3 class="gapply-heading">지침서 기준 시점</h3>'
        +'<div class="detail-card gapply-card">'
          +'<div class="gapply-row-wrap">'
            +'<div class="gapply-line">' + siteGuidelineControlsHtml(draft.appliedGuidelines, deadlineEditable) + '</div>'
            + (deadlineEditable ? '<button class="btn" id="stampSiteGuidelineBtn" type="button">현재 지침서 기준으로 채우기</button>' : '')
          +'</div>'
        +'</div>';
    }

    var afterCount = rel.after.length;
    var tabsHtml = "";
    if(draft.deadline){
      tabsHtml = '<div class="seg" style="margin-bottom:14px;">'
        +'<button data-site-mode="checklist" class="'+(S.siteViewMode!=="after"?"on":"")+'" type="button">체크리스트 ('+rel.before.length+')</button>'
        +'<button data-site-mode="after" class="'+(S.siteViewMode==="after"?"on":"")+'" type="button">마감 이후 변경'+(afterCount?' ('+afterCount+')':'')+'</button>'
      +'</div>';
    }

    var mode = (draft.deadline && S.siteViewMode === "after") ? "after" : "checklist";
    var showCheckbox = mode !== "after";
    var activeList = mode === "after" ? rel.after : rel.before;
    var activeStat = statsForList(activeList, appliedMap);
    var activePct = activeStat.total ? Math.round(activeStat.applied/activeStat.total*100) : 0;
    var activeLocked = mode === "after" ? !canWrite() : (locked || !canWrite());

    var afterNote = "";
    if(mode === "after"){
      afterNote = '<div class="after-heading">⚠️ 실행마감('+fmtDate(draft.deadline,deadlinePrecision)+') 이후 변경된 기준</div>'
        +'<div class="after-desc">'+esc(s.name)+'의 실행에는 반영되지 않았어요 — 참고용으로만 확인하세요.</div>';
    }

    var progress = "";
    if(showCheckbox){
      progress = '<div class="site-progress">'
        +'<div class="site-progress-bar"><div class="site-progress-fill" style="width:'+activePct+'%;"></div></div>'
        +'<div class="site-progress-label mono">반영 완료 '+activeStat.applied+' / '+activeStat.total+'건 ('+activePct+'%)</div>'
      +'</div>';
    }

    var activeListHtml = groupedChecklistHtml(activeList, appliedMap, activeLocked, showCheckbox);
    if(!activeListHtml){
      activeListHtml = mode === "after"
        ? '<div class="empty">실행마감 이후 승인된 기준이 없습니다.</div>'
        : '<div class="empty">'+(draft.deadline ? '실행 마감일 이전 승인된 기준이 없습니다.' : '아직 승인된 실행기준이 없습니다.')+'</div>';
    }

    return '<div class="detail">'
      +'<a class="back-link" href="#/sites">&larr; 현장 목록으로</a>'
      +'<div class="content-head"><div><h1>'+esc(s.name)+'</h1><div class="meta">실행편성 때 반영한 기준을 체크하고, 저장 버튼을 눌러 반영하세요.</div></div></div>'
      +controlCard
      +guidelineCard
      +tabsHtml
      +afterNote
      +progress
      +activeListHtml
    +'</div>';
  }

  function toggleSiteApplied(siteId, changeId, applied){
    // 체크박스는 더 이상 클릭 즉시 DB에 쓰지 않고 초안(S.siteDraft)만 바꾼다 — 통합 저장 버튼을 눌러야 반영된다.
    // (예전에는 appliedMap을 {[changeId]:...} 하나짜리 객체로 통째로 덮어써서 다른 체크가 지워지는 버그가
    //  있었는데, 이제는 초안 전체를 기준으로 병합하므로 그 문제도 함께 방지된다.)
    if(!S.siteDraft) return;
    var merged = Object.assign({}, S.siteDraft.appliedMap || {});
    if(applied) merged[changeId] = { by:S.viewerId, byName:S.viewerName||"", at: nowIso() };
    else delete merged[changeId];
    S.siteDraft.appliedMap = merged;
    render();
  }

  function requestSiteApproval(id){
    if(!S.db) return;
    var s = S.sites.find(function(x){ return x.id===id; });
    if(!s) return;
    // 승인요청을 누르면, 저장 버튼을 따로 안 눌렀더라도 화면에 입력해둔 초안(실행마감일/담당자/
    // 지침서시점/체크리스트)까지 함께 반영해서 한번에 저장한다 — 그래야 입력 내용이 안 날아간다.
    var draft = S.siteDraft;
    // manager_id는 uuid 컬럼이라, 담당자를 "미지정"으로 두면(draft.managerId==="") 빈 문자열이
    // 아니라 null을 보내야 한다 — 새로 만든 현장처럼 담당자를 아직 안 고른 상태에서 승인요청을
    // 누르면 DB 타입 오류로 저장이 실패하던 게 이 문제였다.
    var data = { checklistStatus:"pending_approval", submittedById:S.viewerId, submittedByName:S.viewerName||"", submittedAt:nowIso() };
    if(draft){
      data.deadline = draft.deadline||"";
      data.managerId = draft.managerId||null;
      data.managerName = draft.managerId ? ((S.members[draft.managerId] && S.members[draft.managerId].name) || "") : "";
      data.appliedGuidelines = draft.appliedGuidelines||{};
      data.appliedMap = draft.appliedMap||{};
    }
    S.db.doc("sites/"+id).update(data).then(function(){
      S.siteDraft = null;
      toast("파트장에게 승인을 요청했습니다.");
    }).catch(function(err){ console.warn(err); toast("요청 중 오류가 발생했습니다."); });
  }
  function approveSiteChecklist(id){
    if(!S.db || !S.isPartLeader) return;
    S.db.doc("sites/"+id).update({
      checklistStatus:"approved",
      approvedById:S.viewerId, approvedByName:S.viewerName||"", approvedAt:nowIso()
    }).then(function(){ toast("체크리스트를 승인했습니다. 이제 잠기고, 이후 새로 생긴 기준만 계속 업데이트돼요."); })
      .catch(function(err){ console.warn(err); toast("승인 중 오류가 발생했습니다."); });
  }
  function reopenSiteChecklist(id){
    if(!S.db || !(S.isPartLeader||S.isOwner)) return;
    S.db.doc("sites/"+id).update({
      checklistStatus:"draft",
      reopenedById:S.viewerId, reopenedByName:S.viewerName||"", reopenedAt:nowIso()
    }).then(function(){ toast("체크리스트를 다시 열었습니다."); })
      .catch(function(err){ console.warn(err); toast("처리 중 오류가 발생했습니다."); });
  }
  // 승인요청 취소: 승인 대기중 상태를 다시 draft로 되돌린다 (제출 정보 초기화).
  // submitted_by는 uuid, submitted_at은 timestamptz라 ""(빈 문자열) 대신 null로 비워야 한다.
  function cancelSiteApprovalRequest(id){
    if(!S.db || !canWrite()) return;
    S.db.doc("sites/"+id).update({
      checklistStatus:"draft",
      submittedById:null, submittedByName:"", submittedAt:null,
      cancelledById:S.viewerId, cancelledByName:S.viewerName||"", cancelledAt:nowIso()
    }).then(function(){ toast("승인요청을 취소했습니다."); })
      .catch(function(err){ console.warn(err); toast("처리 중 오류가 발생했습니다."); });
  }
  // 승인완료 취소: 승인됨 상태를 다시 담당자가 수정할 수 있는 draft 상태로 되돌린다(승인·제출 정보 초기화).
  // 담당자는 현장을 개설해 수정하다가 최종본을 파트장에게 승인요청하고, 승인되면 잠기는 흐름이라 —
  // 파트장이 승인을 취소하면 곧바로 다시 수정 가능해져야 한다(승인 대기중을 한번 더 거치지 않는다).
  // approved_by/submitted_by는 uuid 컬럼, approved_at/submitted_at은 timestamptz 컬럼이라 빈 문자열("")을
  // 넣으면 DB에서 타입 변환 오류가 나서 저장이 실패했었다 — null로 비워야 한다.
  function undoSiteApproval(id){
    if(!S.db || !(S.isPartLeader||S.isOwner)) return;
    S.db.doc("sites/"+id).update({
      checklistStatus:"draft",
      approvedById:null, approvedByName:"", approvedAt:null,
      submittedById:null, submittedByName:"", submittedAt:null
    }).then(function(){ toast("승인을 취소했습니다. 다시 수정할 수 있어요."); })
      .catch(function(err){ console.warn(err); toast("처리 중 오류가 발생했습니다."); });
  }

  function wireSiteDetail(id){
    document.querySelectorAll(".rowmain[data-open]").forEach(function(el){
      el.addEventListener("click", function(){ location.hash = "#/item/"+el.getAttribute("data-open"); });
    });
    document.querySelectorAll("[data-apply-toggle]").forEach(function(cb){
      cb.addEventListener("change", function(){
        toggleSiteApplied(id, cb.getAttribute("data-apply-toggle"), cb.checked);
      });
    });
    var deadlineInput = document.getElementById("s-deadline-edit");
    if(deadlineInput) deadlineInput.addEventListener("change", function(){
      if(!S.siteDraft) return;
      S.siteDraft.deadline = deadlineInput.value;
      render();
    });
    var managerSel = document.getElementById("s-manager-edit");
    if(managerSel) managerSel.addEventListener("change", function(){
      setSiteManager(id, managerSel.value);
    });
    var stampBtn = document.getElementById("stampSiteGuidelineBtn");
    if(stampBtn) stampBtn.addEventListener("click", function(){ stampSiteGuideline(id); });
    document.querySelectorAll("[data-gapply-major]").forEach(function(sel){
      sel.addEventListener("change", function(){
        stampSiteGuidelineMajor(id, sel.getAttribute("data-gapply-major"), sel.value);
      });
    });
    var saveAllBtn = document.getElementById("saveSiteAll");
    if(saveAllBtn) saveAllBtn.addEventListener("click", function(){ saveSiteAll(id); });
    var reqBtn = document.getElementById("btnRequestSiteApproval");
    if(reqBtn) reqBtn.addEventListener("click", function(){ requestSiteApproval(id); });
    var apBtn = document.getElementById("btnApproveSite");
    if(apBtn) apBtn.addEventListener("click", function(){ approveSiteChecklist(id); });
    var reopenBtn = document.getElementById("btnReopenSite");
    if(reopenBtn) reopenBtn.addEventListener("click", function(){ reopenSiteChecklist(id); });
    var cancelReqBtn = document.getElementById("btnCancelSiteRequest");
    if(cancelReqBtn) cancelReqBtn.addEventListener("click", function(){ cancelSiteApprovalRequest(id); });
    var undoApproveBtn = document.getElementById("btnUndoSiteApproval");
    if(undoApproveBtn) undoApproveBtn.addEventListener("click", function(){ undoSiteApproval(id); });
    document.querySelectorAll("[data-site-mode]").forEach(function(btn){
      btn.addEventListener("click", function(){
        S.siteViewMode = btn.getAttribute("data-site-mode");
        render();
      });
    });
  }

  /* ============ view wiring dispatcher ============ */
  function wireView(parts){
    if(parts[0] === "item" && parts[1]){ wireItem(parts[1]); return; }
    if(parts[0] === "new"){ wireForm(); return; }
    if(parts[0] === "edit" && parts[1]){ wireForm(parts[1]); return; }
    if(parts[0] === "approvals"){ wireRows(); return; }
    if(parts[0] === "settings"){ wireSettings(); return; }
    if(parts[0] === "sites" && parts[1]){ wireSiteDetail(parts[1]); return; }
    if(parts[0] === "sites"){ wireSites(); return; }
    if(parts[0] === "dept" && !parts[1]){ wireDeptPicker(); return; }
    wireRows(); resolveNames();
  }

  boot();
