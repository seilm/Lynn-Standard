
  "use strict";

  if(window.pdfjsLib){
    try{ window.pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js"; }catch(e){}
  }

  var LYNN_LOGO = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPkAAAB3CAYAAADB9eY4AAAHRElEQVR4nO3d4XUaRxTF8escfRepQHQgOhCpwJMKvB1EHciuwKQC00HGFViuILgCowqMK1A+DMSyLGB33mN3mfn/zuHk2OaxTxIXLhDQq8fHx3tJN8rzTtLbzFkAPfht6AUAnBYhBwpHyIHCEXKgcIQcKBwhBwpHyIHCEXKgcIQcKBwhBwpHyIHCEXKgcIQcKBwhBwpHyIHCEXKgcIQcKBwhBwpHyIHCEXKgcIQcKBwhBwpHyIHCEXKgcIQcKBwhBwpHyIHCXQy9gJO5bL+TLUjaOOzhKUqaGGYXLc53n3n5y+3Jaqb0Ne7++9x6e1qpn59Psz3lmDscf6KfvyfPbfTje7Fqe6GlhHyl/F/aKKWQLz0WcTKT9Nowv2h5vtzv2X3GzETp+zxX+vquO84/bI97r9P9rKayXY+6mj85zSRddpz/rHSDHpVuDF9USl3fSPpomA8+a7hpDLPflX7oYzCRdKt0I/xN0gdJb9Q94JJ0tZ39oPTzfqv8pjOkoHQjtZH0SdKd0g1L14BrO/de0lelG7/ZS2cqJeSS7Yr9WuO6wgTDbHTawWKutMc3pSthTqgPuVQKx0p7rtgjM1G6UVpL+kfpxion1IfcSPpXLzxsJeQ/BIcdPMyU7rVyRZ81sjRKwfsk28ONtq504B5sBKZK99rflG6ULD/Xtu707OFMSSHfyFbZG581zBrD7FBVfa4Utg/yv9c+5lLjC/pE6R71q9K9dt/e6MnzMiWFXLJdwW+UbnmHFgyz0WmHtibbY35Sv09YPXep8Txx2ijV8rth19Bf2j7jT8h/Fhx2sJjJVukWPmu00ihdmfuo5W1ca9g2NtWPNuP9eDvXQiov5Budd2W3HP9BHV47NbrVuK7MO82Ax15p2DbzkmtJs9JCLtnuza81bGUPhtnotEMbYwv3zo2Ge5VkrN+TQMh/FRx2yDGTraovfdY4e7OhFxiZeYkh3+g8K7vluH1W9bGbD73AyExLDLlku1cbqrIHw2x02qGtd5JenfD0Z39fiptTfj9+V/pfWHNclRryqPSaca7gs0Zrc1HVn4pDLzAyG+W/mai4Z9efiobZxmmHPo5HVcdBhPxlfVf2YJiNTjugUKWH/Bwqe5Dt5ZelzxooVckhl86jsgfDLFUdRxHy/a7Vz2uuwTAbnXZAwWoIuaWyNz5r7BVEVceJlR5yyXZvF5x2OMXlU9XRCiE/7EqnrezBMLtw2gGFqyXkY6zsQbaqHn3WQOlqCLk0zspuudwvOvDpnMBThPy4U1X2YJhdOu2ACtQU8jFV9iCqOnpSS8gl271fcNrB4/Ko6uiEkLfjWdknoqqjRzWFfKX02nKuxmcNqjr6VVPIpXE8y265HKo6Oqst5EvDrEdln8j2EcZL4/FRodpCvpKtst8ajx+M89E4jwrVFnJp2MpumaeqI0uNIV8aZi+VH9SJqOoYQI0hX8lW2UPPczvROI9K1RhyaZjKnjsnpc+RXxvmUbFaQ740zOZU9olsVT0aZlG5WkO+Ur+Vvev5n4vGeVSs1pBL/Vb2rud/6qPSh+sDWWoO+cIw26WyT0RVx4BqDvla6bXnXMH5fPtE4zwqV3PIpX7efnprOAZVHWa1hzwaZttU9qnS57fnioZZQBIhX+u0lf3Yvx8TjfNA9SGX7JV9cuDfG8NlU9XhgpCfrrJPRVXHCBDy01X2fX/fVjTOA5KkC+P8XNJb+xquVuoekKWk95nHe61U2TfP/r7JvDyJqg5H1pDfbE9j8qDuIY/KD7mU7rWXT/48la2qL4+eA2ipxLqe8zFNa/lW9ud/7uK7qOpwVGLIpbyqvDQcb1fZLcffiYZZ4BelhjxkzESnY07Fs+oYkVJDPmRlDwfOcwxVHe5KDbmUV5kXhuPtKnvOcXeiYRZ4UckhDxkz0XjMW1HVMTIlhzynsm+UXqPOdWeYparjJEoOuZRXnaPzDmM/LgpXeshDxkx03mHsx0XhSg/5EJU9B1UdJ1N6yKXzqOx9Hw8VIeQvi847jO14qMiF0ru2SjdTt69zI+lvta/6M6X3lucYsqp/zpxbey6xxxC7rQ3HPbW1Mnd79fj46LtKndZKj/9z/C37r0QG9qqhrp/aTPkBl3hbKU6MkNs1htkH1fFwCQMi5HbBMBuddgD2IuQ2M1HVMXKE3KYxzFLV0QtCbtMYZqPTDsBBhDxfUP5r4xJVHT0h5PmCYZaqjt4Q8nzBMBuddgCOIuR5gqjqOBOEPE8wzFLV0StCnicYZqPTDkArhLy7IFtVX/isAbRDyLsLhtkv6udtmsD/CHl3wTC7dNoBaI2QdxNkq+rRZw2gPULeTTDMUtUxCELeTTDMLp12ADoh5O0FUdVxhgh5e41hlqqOwRDydiZKv7U019JnDaA7Qt5OMM5Hhx2ALIS8nWCYpapjUIT8uImo6jhjhPy4YJyPDjsA2Qj5ccEwS1XH4Aj5YRPZqvrCZw0g38XQC5yBPwyzK68lgFz/Ab3aL1tX07mjAAAAAElFTkSuQmCC";

  /* ============ static taxonomy ============ */
  var CATEGORY_TREE = {
    "공통가설": ["01. 가설건물","02. 환경관리비","03. 가시설물","04. 가설설비","05. 장비비","06. 기타공통가설공사"],
    "건축": ["01. 가설공사","02. 파일공사","03. 철근콘크리트공사","04. 조적공사","05. 방수공사","06. 미장공사","07. 타일공사","08. 석공사","09. 내장공사","10. 창호공사","11. 유리공사","12. 도장공사","13. 수장공사","14. 금속공사","15. 잡공사","16. 가구공사","17. 인테리어공사","18. 특화공사"],
    "현관비": ["01. 급여","02. 복리후생비","03. 여비교통비","04. 통신비","05. 집기비품","06. 도서인쇄비","07. 수도광열비","08. 예비비","09. 수선비","10. 세금과공과","11. 지급수수료","12. 판매관리비","13. TFT 운영비용"]
  };
  var MAJORS = ["공통가설","건축","현관비"];
  var MAJOR_COLOR = { "공통가설":"#4a5fd1", "건축":"#0f8f7e", "현관비":"#9350ae" };

  var ACCEPT_EXT = {
    ".pdf":"application/pdf", ".png":"image/png", ".jpg":"image/jpeg", ".jpeg":"image/jpeg",
    ".gif":"image/gif", ".webp":"image/webp", ".svg":"image/svg+xml",
    ".csv":"text/csv", ".txt":"text/plain", ".md":"text/markdown", ".json":"application/json",
    ".xlsx":"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ".xls":"application/vnd.ms-excel"
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
    viewerId:null, isOwner:false, isPartLeader:false, isTeamMember:false, canManageRoster:false,
    ready:false,
    changes:[], members:{}, sites:[],
    filters:{ major:null, minor:null, status:"approved", q:"" },
    collapsedMajors:{},
    formExecItems:[], formAttachments:[],
    attachItemId:null, attachIndex:0,
    lastListHash:"#/",
    formEditId:undefined,
    deleteConfirmId:null,
    sidebarW:196,
    siteDetailId:null, siteViewMode:"checklist",
    showWelcome:false,
    unsubs:[]
  };

  (function loadPanelWidths(){
    try{
      var sw = localStorage.getItem("lynn_sidebarW"); if(sw) S.sidebarW = Math.max(150, Math.min(420, parseInt(sw,10)||196));
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
    t.textContent = msg; t.classList.add("show");
    clearTimeout(t._h);
    t._h = setTimeout(function(){ t.classList.remove("show"); }, 2600);
  }
  function statusLabel(st){ return st==="approved" ? "승인됨" : st==="pending" ? "대기중" : "반려됨"; }
  function statusChip(st){ return '<span class="chip '+st+'">'+statusLabel(st)+'</span>'; }
  function urgencyChip(u){
    if(u==="required") return '<span class="chip urgent-required">🔴 필수반영</span>';
    if(u==="confirm") return '<span class="chip urgent-confirm">🟡 확인필요</span>';
    return "";
  }
  function canEditChange(c){
    if(!c || c.status !== "pending") return false;
    return c.submittedById === S.viewerId || S.isPartLeader || S.isOwner;
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

  /* ============ magnifier ============ */
  var magLensEl = null;
  function getMagLens(){
    if(!magLensEl){
      magLensEl = document.createElement("div");
      magLensEl.className = "mag-lens";
      document.body.appendChild(magLensEl);
    }
    return magLensEl;
  }
  function attachMagnifier(target, imgSrc){
    if(!window.matchMedia || !window.matchMedia("(hover:hover) and (pointer:fine)").matches) return;
    target.style.cursor = "zoom-in";
    target.addEventListener("mousemove", function(e){
      var lens = getMagLens();
      var rect = target.getBoundingClientRect();
      var xPct = (e.clientX-rect.left)/rect.width;
      var yPct = (e.clientY-rect.top)/rect.height;
      var lensSize = 190; var zoom = 2.4;
      var bgW = rect.width*zoom, bgH = rect.height*zoom;
      lens.style.left = (e.clientX-lensSize/2)+"px";
      lens.style.top = (e.clientY-lensSize/2)+"px";
      lens.style.backgroundImage = "url('"+imgSrc+"')";
      lens.style.backgroundSize = bgW+"px "+bgH+"px";
      lens.style.backgroundPosition = (-(xPct*bgW-lensSize/2))+"px "+(-(yPct*bgH-lensSize/2))+"px";
      lens.style.display = "block";
    });
    target.addEventListener("mouseleave", function(){
      if(magLensEl) magLensEl.style.display = "none";
    });
  }
  /* ============ Supabase data adapter (Firestore-like surface) ============
     Reproduces the small slice of the Firestore client API this app relies on
     (.doc(path).update/delete, .collection(name).add/orderBy/limit/onSnapshot),
     backed by real Supabase tables, with camelCase(JS) <-> snake_case(Postgres)
     field mapping handled per collection so the rest of app.js needs no changes. */

  var COLLECTION_TABLE = { changes: "changes", sites: "sites", members: "profiles" };

  var FIELD_MAP = {
    changes: {
      major:"major", minor:"minor", title:"title", summary:"summary",
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
      submittedById:"submitted_by", submittedByName:"submitted_by_name", submittedAt:"submitted_at",
      approvedById:"approved_by", approvedByName:"approved_by_name", approvedAt:"approved_at",
      reopenedById:"reopened_by", reopenedByName:"reopened_by_name", reopenedAt:"reopened_at",
      updatedById:"updated_by", updatedByName:"updated_by_name", updatedAt:"updated_at",
      createdAt:"created_at"
    },
    members: {
      name:"name", displayName:"display_name", role:"role", isAdmin:"is_admin",
      firstSeenAt:"first_seen_at", lastSeenAt:"last_seen_at",
      addedBy:"added_by", addedAt:"added_at", createdAt:"created_at"
    }
  };

  function reverseMap(m){
    var r = {};
    Object.keys(m).forEach(function(k){ r[m[k]] = k; });
    return r;
  }
  var FIELD_MAP_REV = { changes: reverseMap(FIELD_MAP.changes), sites: reverseMap(FIELD_MAP.sites), members: reverseMap(FIELD_MAP.members) };

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

  function makeDb(sb){
    function docRef(path){
      var parts = path.split("/");
      var coll = parts[0], id = parts[1];
      var table = COLLECTION_TABLE[coll] || coll;
      return {
        update: function(data){
          return sb.from(table).update(toRow(coll, data)).eq("id", id).then(function(res){
            if(res.error) throw res.error;
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
        S.isPartLeader=false; S.isTeamMember=false; S.canManageRoster=false; S.isOwner=false;
        S.changes=[]; S.members={}; S.sites=[];
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

    var parts = route();
    var listLikeRoutes = ["month","approvals","sites"];
    if(!parts[0] || listLikeRoutes.indexOf(parts[0])!==-1){
      S.lastListHash = location.hash || "#/";
    }
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
    return '<div class="auth-gate-logo"><img src="'+LYNN_LOGO+'" alt="Lynn"><span>Standard</span></div>';
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
        +'<h1>Lynn Standard</h1>'
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
        +'<div class="f-field" style="text-align:left;margin-bottom:6px;"><label for="welcomeNameInput">화면에 표시될 이름 (선택)</label><input id="welcomeNameInput" type="text" placeholder="예: 김세림 대리" value="'+esc(name)+'"></div>'
        +'<div style="font-size:11px;color:var(--ink-faint);text-align:left;margin-bottom:16px;">비워두면 "'+esc(name)+'"으로 표시돼요. 나중에 설정 페이지에서 바꿀 수 있어요.</div>'
        +'<button class="btn accent" id="btnWelcomeStart" type="button" style="width:100%;">시작하기</button>'
      +'</div>'
    +'</div>';
  }
  function wireWelcomeGate(){
    var btn = document.getElementById("btnWelcomeStart");
    if(!btn) return;
    btn.addEventListener("click", function(){
      var input = document.getElementById("welcomeNameInput");
      var val = input ? (input.value||"").trim() : "";
      S.showWelcome = false;
      if(val && val !== S.viewerName && S.db && S.viewerId){
        S.db.doc("members/"+S.viewerId).update({ displayName: val }).catch(function(){});
      }
      render();
    });
  }

  /* ============ shell (topbar + sidebar) ============ */
  function pendingCount(){ return S.changes.filter(function(c){ return c.status==="pending"; }).length; }
  function viewerDisplayName(){
    var m = S.members && S.members[S.viewerId];
    var d = m && m.displayName ? m.displayName.trim() : "";
    return d || (S.viewerName || "");
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
      +'<div class="brand" data-nav="home"><span class="brand-logo"><img src="'+LYNN_LOGO+'" alt="Lynn"></span><span class="mark">Standard</span><span class="sub">건축예산팀 · 실행파트</span></div>'
      +'<div class="search-wrap"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="M21 21l-3.5-3.5"/></svg>'
        +'<input id="searchInput" type="text" placeholder="공종·내용·#태그 검색" value="'+esc(S.filters.q)+'"></div>'
      +'<div class="topbar-actions">'
        +'<button class="pill tb" data-nav-month="'+ymOf(new Date())+'">이번달</button>'
        +'<button class="pill tb" data-nav="approvals">승인대기'+(pc>0?'<span class="badge">'+pc+'</span>':'')+'</button>'
        +'<button class="pill tb" data-nav="sites">현장현황</button>'
        +(canWrite() ? '<button class="btn accent" data-nav="new">+ 신규 등록</button>' : '')
      +'</div>'
      +'<div class="who" title="설정">'
        +'<div data-nav="settings" style="cursor:pointer;"><div class="name" id="viewerNameSlot">'+esc(viewerDisplayName())+'</div><div class="role'+(S.isPartLeader?' lead':'')+'">'+(S.isPartLeader?'파트장':(S.isTeamMember?'팀원':'조회자'))+'</div></div>'
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
    +'</div>';
  }

  function applyLayoutWidths(){
    var root = document.getElementById("layoutRoot");
    if(!root) return;
    if(window.innerWidth <= 760) return; // mobile: CSS forces single column
    root.style.gridTemplateColumns = S.sidebarW+"px 6px 1fr";
  }

  function wireShell(){
    document.querySelectorAll("[data-nav]").forEach(function(el){
      el.addEventListener("click", function(){
        var v = el.getAttribute("data-nav");
        if(v==="all"){ S.filters.major=null; S.filters.minor=null; location.hash="#/"; render(); }
        else if(v==="home"){ S.filters.major=null; S.filters.minor=null; location.hash="#/"; render(); }
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
    wireResizeHandles();
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
    return S.changes.filter(function(c){
      if(S.filters.major && c.major !== S.filters.major) return false;
      if(S.filters.minor && c.minor !== S.filters.minor) return false;
      if(S.filters.status !== "all" && c.status !== S.filters.status) return false;
      if(monthYm && (c.changeDate||"").slice(0,7) !== monthYm) return false;
      if(S.filters.q){
        var q = S.filters.q.toLowerCase().trim().replace(/^#/, "");
        var hay = [c.title,c.summary,c.reason,c.major,c.minor,(c.tags||[]).join(" ")].join(" ").toLowerCase();
        if(hay.indexOf(q) === -1) return false;
      }
      return true;
    });
  }

  function viewList(monthYm){
    var heading = monthYm ? fmtYm(monthYm)+" 변경사항" : (S.filters.minor || S.filters.major || "전체 공종 · 최근 변경");
    var d = new Date(monthYm ? monthYm+"-01" : ymOf(new Date())+"-01");
    var head = '<div class="content-head"><div><h1 id="listHeading">'+esc(heading)+'</h1>'
      +'<div class="meta">'+(monthYm ? '해당 월에 등록·승인된 실행 편성 기준 변경 이력' : '전체 공종의 실행 편성 기준 변경 이력 (최신순)')+'</div></div>';
    if(monthYm){
      var prevD = new Date(d); prevD.setMonth(prevD.getMonth()-1);
      var nextD = new Date(d); nextD.setMonth(nextD.getMonth()+1);
      head += '<div class="month-nav">'
        +'<button class="icon-btn" data-nav-month="'+ymOf(prevD)+'">‹</button>'
        +'<input type="month" id="monthPick" value="'+monthYm+'" style="padding:8px 10px;border:1px solid var(--line);border-radius:8px;background:var(--surface);">'
        +'<button class="icon-btn" data-nav-month="'+ymOf(nextD)+'">›</button>'
      +'</div>';
    }
    head += '</div>';

    var statBar = "";
    if(!monthYm && !S.filters.major && !S.filters.minor){
      var curYm = ymOf(new Date());
      var thisMonthCount = S.changes.filter(function(c){ return (c.changeDate||"").slice(0,7)===curYm; }).length;
      statBar = '<div class="stat-row">'
        +'<button class="stat-tile" type="button" data-stat="all"><div class="n mono">'+S.changes.filter(function(c){return c.status==="approved";}).length+'</div><div class="l">전체 등록 건수</div></button>'
        +'<button class="stat-tile" type="button" data-stat="month"><div class="n mono">'+thisMonthCount+'</div><div class="l">이번달 변경 건수</div></button>'
        +'<button class="stat-tile amber" type="button" data-stat="pending"><div class="n mono">'+pendingCount()+'</div><div class="l">승인대기 건수</div></button>'
      +'</div>';
    }

    var banner = "";
    if(pendingCount()>0 && S.isPartLeader){
      banner = '<div class="banner">승인 대기 중인 항목이 '+pendingCount()+'건 있어요.<button class="btn ghost" data-nav="approvals">확인하기</button></div>';
    }

    return head + statBar + banner + filterRow() + '<div id="listArea">'+listBody(monthYm)+'</div>';
  }

  function filterRow(){
    var statuses = [["approved","승인됨"],["pending","대기중"],["rejected","반려됨"],["all","전체"]];
    var html = '<div class="filter-row">';
    statuses.forEach(function(s){
      html += '<button class="pill'+(S.filters.status===s[0]?' on':'')+'" data-status="'+s[0]+'">'+s[1]+'</button>';
    });
    if(S.filters.major || S.filters.minor){
      html += '<button class="pill" data-clear-cat="1">'+esc(S.filters.minor||S.filters.major)+' ✕</button>';
    }
    html += '</div>';
    return html;
  }

  function listBody(monthYm){
    var items = filteredScoped(monthYm);
    if(items.length === 0){
      return '<div class="empty">해당 조건의 변경 이력이 없습니다.'+(S.filters.status==="approved" && !monthYm ? ' 최근 1년간 이 공종은 기준 변경이 없었어요.' : '')+'</div>';
    }
    // group by major then minor for the unfiltered/home browse; otherwise flat sorted list
    if(!S.filters.minor && !monthYm){
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
    var hideCat = !!S.filters.minor;
    return '<div class="change-list">'+items.slice().sort(byDateDesc).map(function(c){ return rowHtml(c, hideCat); }).join("")+'</div>';
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
    var clearCat = document.querySelector("[data-clear-cat]");
    if(clearCat) clearCat.addEventListener("click", function(){ S.filters.major=null; S.filters.minor=null; render(); });
    var mp = document.getElementById("monthPick");
    if(mp) mp.addEventListener("change", function(){ location.hash = "#/month/"+mp.value; });
    document.querySelectorAll("[data-stat]").forEach(function(el){
      el.addEventListener("click", function(){
        var v = el.getAttribute("data-stat");
        if(v==="all"){ S.filters.major=null; S.filters.minor=null; S.filters.status="approved"; S.filters.q=""; location.hash="#/"; render(); }
        else if(v==="month"){ S.filters.major=null; S.filters.minor=null; location.hash="#/month/"+ymOf(new Date()); render(); }
        else if(v==="pending"){ location.hash="#/approvals"; render(); }
      });
    });
  }

  /* ============ item detail ============ */
  function viewItem(id){
    var c = S.changes.find(function(x){ return x.id===id; });
    if(!c) return '<div class="detail"><div class="empty">항목을 찾을 수 없습니다.</div></div>';
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
      var body; var magHint = "";
      if(a.contentType === "application/pdf"){
        body = '<div class="att-pdf-host" id="attPdfHost"><div class="att-fallback" style="padding:14px;font-size:12px;color:var(--ink-faint);">PDF 불러오는 중…</div></div>';
        magHint = '<div class="mag-hint avail">🔍 마우스를 올리면 확대해서 볼 수 있어요</div>';
      } else if((a.contentType||"").indexOf("image/")===0){
        body = '<img id="attImg" src="'+a.url+'" alt="'+esc(a.name)+'" onerror="this.parentElement.querySelector(\'.att-fallback\').style.display=\'block\';this.style.display=\'none\';">' + '<div class="att-fallback" style="display:none;padding:14px;font-size:12px;color:var(--ink-faint);">이미지를 불러오지 못했습니다. 아래 링크로 열어주세요.</div>';
        magHint = '<div class="mag-hint avail">🔍 마우스를 올리면 확대해서 볼 수 있어요</div>';
      } else if(isExcelMime(a.contentType)){
        body = '<div class="att-excel-host" id="attExcelHost" data-kind="excel"><div class="att-fallback" style="padding:14px;font-size:12px;color:var(--ink-faint);">표 불러오는 중…</div></div>'
          + (a.sheetCount>1 ? '<div class="att-excel-note">첫 번째 시트만 미리보기에 반영돼요 (전체 '+a.sheetCount+'개 시트)</div>' : '');
      } else if(a.contentType === "text/csv"){
        body = '<div class="att-excel-host" id="attExcelHost" data-kind="csv"><div class="att-fallback" style="padding:14px;font-size:12px;color:var(--ink-faint);">표 불러오는 중…</div></div>';
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
        +body
      +'</div>'+magHint+'</div>';
    }

    var reasonBlock = c.reason ? '<div class="block"><h3>변경 사유</h3><p>'+esc(c.reason)+'</p></div>' : "";

    var approveBar = "";
    if(c.status==="pending"){
      var editBtnHtml = canEditChange(c) ? '<button class="btn ghost" id="btnEditChange" type="button">수정</button>' : "";
      if(S.isPartLeader){
        approveBar = '<div class="approve-bar">'
          + editBtnHtml
          +'<button class="btn" id="btnApprove">승인</button>'
          +'<button class="btn danger" id="btnRejectToggle">반려</button>'
        +'</div>'
        +'<div class="reject-box" id="rejectBox"><textarea id="rejectReason" placeholder="반려 사유를 입력해주세요"></textarea>'
          +'<div style="display:flex;gap:8px;"><button class="btn danger" id="btnRejectConfirm">반려 확정</button><button class="btn ghost" id="btnRejectCancel">취소</button></div></div>';
      } else {
        approveBar = '<div class="banner info">파트장 승인 대기 중입니다.</div>'
          + (editBtnHtml ? '<div style="margin-top:10px;">'+editBtnHtml+'</div>' : "");
      }
    } else if(c.status==="rejected" && c.rejectReason){
      approveBar = '<div class="block"><h3>반려 사유</h3><p>'+esc(c.rejectReason)+'</p></div>';
    }

    var deleteBlock = "";
    if(canDelete()){
      var delOpen = S.deleteConfirmId === c.id;
      deleteBlock = '<div class="approve-bar" style="border-top:1px dashed var(--line-soft);">'
        +'<button class="btn danger" id="btnDeleteToggle" type="button">삭제</button>'
      +'</div>'
      +'<div class="delete-box'+(delOpen?' show':'')+'" id="deleteBox">'
        +'<div class="meta" style="color:var(--bad);">이 항목을 삭제하면 되돌릴 수 없습니다. 정말 삭제할까요?</div>'
        +'<div style="display:flex;gap:8px;"><button class="btn danger" id="btnDeleteConfirm" type="button">삭제 확정</button><button class="btn ghost" id="btnDeleteCancel" type="button">취소</button></div>'
      +'</div>';
    }

    return '<div class="detail">'
      +'<a class="back-link" href="'+esc(S.lastListHash)+'">&larr; 목록으로</a>'
      +'<div class="detail-card">'
        +'<div class="detail-crumb">'+esc(c.major)+' / '+esc(c.minor)+'</div>'
        +'<div class="detail-top"><h2>'+esc(c.title)+'</h2><div style="display:flex;gap:6px;flex-wrap:wrap;flex-shrink:0;">'+urgencyChip(c.urgency)+statusChip(c.status)+'</div></div>'
        +tagsBlock
        +'<div class="fact-line">'
          +'<span class="fl-item"><b>날짜</b><span class="fl-val mono">'+fmtDate(c.changeDate,precision)+'</span></span>'
          +'<span class="fl-item"><b>적용현장</b><span class="fl-val">'+esc(c.effectiveScope||"전현장")+'</span></span>'
          +'<span class="fl-item"><b>등록자</b><span class="fl-val">'+userLabel(c.submittedById, c.submittedByName, "초기 등록")+'</span></span>'
        +'</div>'
        +'<div class="block"><h3>실행 반영 내용</h3><p>'+esc(c.summary)+'</p></div>'
        +execBlock + attachBlock + reasonBlock + approveBar + deleteBlock
      +'</div>'
    +'</div>';
  }

  function wireItem(id){
    var c = S.changes.find(function(x){ return x.id===id; });
    if(!c) return;
    resolveNames();
    var attachments = c.attachments || [];
    var curAtt = attachments[S.attachIndex];
    var pdfHost = document.getElementById("attPdfHost");
    if(pdfHost && curAtt){
      renderPdfInto(pdfHost, curAtt.url, function(canvases){
        canvases.forEach(function(cv){
          try{ attachMagnifier(cv, cv.toDataURL()); }catch(e){}
        });
      });
    }
    var excelHost = document.getElementById("attExcelHost");
    if(excelHost && curAtt){
      if(excelHost.getAttribute("data-kind")==="csv") renderCsvInto(excelHost, curAtt.url);
      else renderExcelInto(excelHost, curAtt.url);
    }
    var attImg = document.getElementById("attImg");
    if(attImg && curAtt){ attachMagnifier(attImg, curAtt.url); }
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
      var live = m && (m.displayName || m.name);
      n.textContent = live || fallback;
    });
  }

  /* ============ new entry form ============ */
  function viewForm(editId){
    var c = editId ? S.changes.find(function(x){ return x.id===editId; }) : null;
    if(editId && !canEditChange(c)){
      return '<div class="detail"><a class="back-link" href="'+esc(S.lastListHash)+'">&larr; 목록으로</a><div class="empty">수정할 수 없는 항목입니다. 대기중 상태이면서 등록자 본인 또는 파트장인 경우에만 수정할 수 있어요.</div></div>';
    }
    if(S.formEditId !== (editId||null)){
      S.formEditId = editId || null;
      if(c){
        S.formExecItems = (c.execItems||[]).map(function(it){ return Object.assign({},it); });
        S.formAttachments = (c.attachments||[]).map(function(a){ return Object.assign({},a); });
      } else {
        S.formExecItems = [];
        S.formAttachments = [];
      }
    }
    S.formExecItems = S.formExecItems.length ? S.formExecItems : [{name:"",spec:"",unit:"",qty:"",unitPrice:"",amount:""}];
    var majorOpts = MAJORS.map(function(m){ return '<option value="'+esc(m)+'">'+esc(m)+'</option>'; }).join("");
    var showApproveCombo = c && S.isPartLeader && c.status==="pending";
    var actionsHtml = showApproveCombo
      ? '<div class="form-actions"><button class="btn ghost" id="cancelForm" type="button">취소</button><button class="btn ghost" id="submitForm" type="button">저장만 (승인 대기 유지)</button><button class="btn" id="submitApproveForm" type="button">수정 후 승인</button></div>'
      : '<div class="form-actions"><button class="btn ghost" id="cancelForm" type="button">취소</button><button class="btn" id="submitForm" type="button">'+(c?'수정 완료':'등록하기')+'</button></div>';
    return '<div class="detail">'
      +'<a class="back-link" href="'+(c ? '#/item/'+editId : '#/')+'">&larr; '+(c?'상세로':'목록으로')+'</a>'
      +'<div class="form-card">'
        +'<h2 style="font-family:var(--font-d);font-size:18px;margin:0 0 4px;">'+(c?'기준 변경 수정':'신규 기준 변경 등록')+'</h2>'
        +'<div class="meta" style="color:var(--ink-faint);font-size:12.5px;margin-bottom:18px;">'+(c?(showApproveCombo?'내용을 수정하고 바로 승인하거나, 승인 대기 상태를 유지한 채 저장할 수 있어요.':'대기중 상태에서만 수정할 수 있어요. 수정 후에도 파트장 승인이 필요합니다.'):'등록 후 파트장 승인을 거쳐 목록에 정식 반영됩니다.')+'</div>'
        +'<div class="f-grid">'
          +'<div class="f-field"><label for="f-changeDate">날짜 (등록일 / 기준변경 시점)</label><input id="f-changeDate" type="date"></div>'
          +'<div class="f-field"><label for="f-major">대분류</label><select id="f-major">'+majorOpts+'</select></div>'
          +'<div class="f-field"><label for="f-minor">중분류(공종)</label><select id="f-minor"></select></div>'
          +'<div class="f-field"><label for="f-urgency">중요도</label><select id="f-urgency">'
            +'<option value="">일반</option>'
            +'<option value="required">🔴 필수반영</option>'
            +'<option value="confirm">🟡 확인필요</option>'
          +'</select></div>'
          +'<div class="f-field full"><label for="f-title">핵심 제목</label><input id="f-title" type="text" placeholder="예: 이동식 미스트 환경관리비 반영" maxlength="80"></div>'
          +'<div class="f-field full"><label for="f-summary">실행 반영 내용 (실행편성 담당자가 바로 알아야 할 내용)</label><textarea id="f-summary" placeholder="예: 환경관리비에 이동식 미스트 반영: 300만원/대. 500세대 이하 2대, 500세대마다 1대 추가 편성."></textarea></div>'
          +'<div class="f-field full"><label for="f-effScope">적용 현장</label><input id="f-effScope" type="text" placeholder="전현장 (또는 예: OO현장부터, LH현장)" value="전현장"></div>'
        +'</div>'
        +'<details class="f-details" id="secExec"><summary>실행양식 (선택 — 품명/규격/단위/수량)</summary><div class="f-details-body">'
          +'<div id="execRows"></div>'
          +'<button class="btn ghost" id="addExecRow" type="button" style="font-size:12px;padding:6px 12px;">+ 행 추가</button>'
        +'</div></details>'
        +'<details class="f-details" id="secReason"><summary>변경 사유 (선택)</summary><div class="f-details-body">'
          +'<textarea id="f-reason" placeholder="배경, 지시자, 근거 등" style="width:100%;"></textarea>'
        +'</div></details>'
        +'<details class="f-details" id="secFiles"><summary>첨부자료 (선택)</summary><div class="f-details-body">'
          +'<div class="file-drop">PDF · 이미지(PNG/JPG) · Excel(XLSX/XLS) · CSV · TXT 파일을 첨부할 수 있어요.<br>Word·PPT 원본은 PDF로 변환 후 첨부해주세요.<br><input type="file" id="f-files" multiple accept=".pdf,.png,.jpg,.jpeg,.gif,.webp,.csv,.txt,.md,.json,.xlsx,.xls" style="margin-top:8px;"></div>'
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
        +'<input data-f="unitPrice" data-i="'+i+'" inputmode="numeric" placeholder="단가(숫자만)" value="'+esc(it.unitPrice)+'">'
        +'<input data-f="amount" data-i="'+i+'" placeholder="금액(자동)" value="'+esc(it.amount)+'" readonly style="background:var(--surface-2);color:var(--ink-soft);">'
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
    var path = Date.now()+"_"+Math.random().toString(36).slice(2,8)+"_"+file.name.replace(/[^\w.\-가-힣]/g,"_");
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
    var majorSel = document.getElementById("f-major");
    var minorSel = document.getElementById("f-minor");
    function fillMinor(){
      minorSel.innerHTML = CATEGORY_TREE[majorSel.value].map(function(m){ return '<option value="'+esc(m)+'">'+esc(m)+'</option>'; }).join("");
    }
    if(c) majorSel.value = c.major;
    else if(S.filters.major) majorSel.value = S.filters.major;
    fillMinor();
    if(c) minorSel.value = c.minor;
    else if(S.filters.minor && CATEGORY_TREE[majorSel.value].indexOf(S.filters.minor)!==-1) minorSel.value = S.filters.minor;
    majorSel.addEventListener("change", fillMinor);

    if(c){
      document.getElementById("f-title").value = c.title||"";
      document.getElementById("f-summary").value = c.summary||"";
      document.getElementById("f-changeDate").value = c.changeDate||"";
      document.getElementById("f-effScope").value = c.effectiveScope||"전현장";
      document.getElementById("f-urgency").value = c.urgency||"";
      document.getElementById("f-tags").value = (c.tags||[]).join(", ");
      document.getElementById("f-reason").value = c.reason||"";
      if(c.reason) document.getElementById("secReason").open = true;
      if((c.execItems||[]).length) document.getElementById("secExec").open = true;
      if((c.attachments||[]).length) document.getElementById("secFiles").open = true;
    } else {
      var today = new Date().toISOString().slice(0,10);
      document.getElementById("f-changeDate").value = today;
    }

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
          toast(file.name + " : 지원하지 않는 형식입니다 (PDF/이미지/Excel/CSV/TXT만 가능)");
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
    var tags = document.getElementById("f-tags").value.split(",").map(function(s){ return s.trim().replace(/^#/,""); }).filter(Boolean);

    if(!title || !summary || !changeDate){ toast("핵심 제목, 실행 반영 내용, 날짜는 필수입니다."); return; }
    if(!S.db){ toast("저장 기능을 사용할 수 없습니다."); return; }

    var execItems = S.formExecItems.filter(function(it){ return it.name || it.spec; });
    var payload = {
      major: major, minor: minor, title: title, summary: summary,
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
        S.formExecItems = []; S.formAttachments = []; S.formEditId = undefined;
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
      S.formExecItems = []; S.formAttachments = []; S.formEditId = undefined;
      location.hash = "#/item/"+ref.id;
    }).catch(function(err){
      console.warn(err);
      toast("등록 중 오류가 발생했습니다.");
    });
  }

  /* ============ approvals ============ */
  function viewApprovals(){
    var items = S.changes.filter(function(c){ return c.status==="pending"; });
    var head = '<div class="content-head"><div><h1>승인 대기</h1><div class="meta">'+(S.isPartLeader?"파트장 승인이 필요한 항목입니다.":"파트장만 승인·반려할 수 있어요.")+'</div></div></div>';
    if(!items.length) return head + '<div class="empty">현재 승인 대기 중인 항목이 없습니다.</div>';
    return head + '<div class="change-list">'+items.slice().sort(byDateDesc).map(rowHtml).join("")+'</div>';
  }

  /* ============ settings ============ */
  function viewSettings(){
    var ids = Object.keys(S.members);
    var rows = ids.map(function(id){
      var m = S.members[id];
      var isMe = id === S.viewerId;
      var seenLabel = m.firstSeenAt ? (fmtDate(m.firstSeenAt.slice(0,10),"day")+' 첫 방문') : '접속 대기중';
      return '<div class="roster-row"><span class="rname">'+(isMe?'<span style="color:var(--accent);">(나) </span>':'')+'<span class="uname" data-uid="'+esc(id)+'">…</span></span>'
        +'<span class="rmeta mono">'+seenLabel+'</span>'
        +(S.canManageRoster ?
          '<div class="seg" data-role-seg="'+esc(id)+'">'
            +'<button data-role="조회자" class="'+(m.role!=="팀원"&&m.role!=="파트장"?"on":"")+'">조회자</button>'
            +'<button data-role="팀원" class="'+(m.role==="팀원"?"on":"")+'">팀원</button>'
            +'<button data-role="파트장" class="'+(m.role==="파트장"?"on":"")+'">파트장</button>'
          +'</div>'
          : '<span class="chip neutral">'+esc(m.role==="팀원"||m.role==="파트장"?m.role:"조회자")+'</span>')
        +'</div>';
    }).join("");

    var addNote = S.canManageRoster
      ? '<div class="detail-card" style="margin-top:14px;">'
        +'<h3 style="font-family:var(--font-d);font-size:14px;margin:0 0 4px;">새 팀원 추가</h3>'
        +'<div class="meta" style="color:var(--ink-faint);font-size:12px;">아직 회원가입하지 않은 사람은 목록에 나타나지 않아요. 먼저 로그아웃 상태에서 회원가입을 하고 접속하면, 아래 팀 구성 목록에 조회자로 나타나요 — 그때 역할을 팀원 또는 파트장으로 바꿔주세요.</div>'
      +'</div>'
      : "";

    var myDisplayName = (S.members[S.viewerId] && S.members[S.viewerId].displayName) || "";
    var myInfoBlock = '<div class="detail-card" style="margin-bottom:14px;">'
      +'<h3 style="font-family:var(--font-d);font-size:14px;margin:0 0 4px;">내 정보</h3>'
      +'<div class="meta" style="color:var(--ink-faint);font-size:12px;margin-bottom:10px;">상단에 표시될 이름을 원하는 형태로 입력하세요 (예: 김세림 대리). 비워두면 계정 이름인 "'+esc(S.viewerName||"")+'"이 표시돼요.</div>'
      +'<div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;">'
        +'<input type="text" id="myNameInput" placeholder="예: 김세림 대리" value="'+esc(myDisplayName)+'" style="flex:1 1 160px;min-width:0;padding:9px 11px;border-radius:8px;border:1px solid var(--line);background:var(--surface);color:var(--ink);">'
        +'<button class="btn ghost" id="btnSaveMyName" type="button">저장</button>'
      +'</div>'
    +'</div>';

    return '<div class="detail">'
      +'<div class="content-head"><div><h1>설정</h1><div class="meta">팀 구성원 역할을 관리합니다. 처음 접속한 사람은 조회자로 등록되고, 파트장/관리자가 팀원·파트장으로 지정해야 신규등록·승인 권한이 생겨요.</div></div></div>'
      + myInfoBlock
      +'<div class="detail-card">'
        +'<h3 style="font-family:var(--font-d);font-size:14px;margin:0 0 10px;">팀 구성 ('+ids.length+'명)</h3>'
        +(rows || '<div class="empty">아직 등록된 팀원이 없습니다.</div>')
        +'<div style="margin-top:16px;font-size:11.5px;color:var(--ink-faint);line-height:1.6;">역할 변경은 파트장 또는 관리자만 할 수 있어요.</div>'
      +'</div>'
      + addNote
    +'</div>';
  }

  function setMemberRole(id, role){
    if(!S.db) return Promise.reject();
    return S.db.doc("members/"+id).update({ role: role });
  }

  function wireSettings(){
    resolveNames();
    var nameBtn = document.getElementById("btnSaveMyName");
    if(nameBtn){
      nameBtn.addEventListener("click", function(){
        if(!S.db || !S.viewerId){ toast("저장 기능을 사용할 수 없습니다."); return; }
        var val = (document.getElementById("myNameInput").value || "").trim();
        S.db.doc("members/"+S.viewerId).update({ displayName: val })
          .then(function(){ toast("저장되었습니다."); })
          .catch(function(err){ console.warn(err); toast("저장 중 오류가 발생했습니다."); });
      });
    }
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
  }

  /* AI 검색 기능은 이 버전에서는 제외했습니다 (자체 AI API 키 + 서버리스 프록시가 필요해서 나중에 별도로 추가할 수 있어요). */

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

    var sortedSites = S.sites.slice().sort(function(a,b){ return (a.name||"").localeCompare(b.name||"","ko"); });
    var rows = sortedSites.map(function(s){
      var stat = siteApplyStats(s);
      var remain = stat.total - stat.applied;
      var precision = (s.deadline||"").length===7 ? "month" : "day";
      return '<button class="row" data-open-site="'+s.id+'">'
        +'<span class="rowdate mono">'+(s.deadline ? fmtDate(s.deadline, precision) : "마감일 미설정")+'</span>'
        +'<div class="rowmain"><div class="rowtitle">'+esc(s.name)+'</div></div>'
        +(stat.afterCount>0 ? '<span class="chip neutral">마감 후 '+stat.afterCount+'건</span>' : '')
        +(remain>0 ? '<span class="chip pending">미반영 '+remain+'건</span>' : '<span class="chip approved">모두 반영</span>')
      +'</button>';
    }).join("");
    var listPart = rows ? '<div class="change-list">'+rows+'</div>' : '<div class="empty">등록된 현장이 없습니다. 위에서 현장을 추가해보세요.</div>';

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
    if(S.siteDetailId !== id){ S.siteDetailId = id; S.siteViewMode = "checklist"; }
    var appliedMap = s.appliedMap || {};
    var rel = siteRelevantChanges(s);
    var deadlinePrecision = (s.deadline||"").length===7 ? "month" : "day";
    var status = s.checklistStatus || "draft";
    var locked = siteChecklistLocked(s);
    var deadlineEditable = !locked && canWrite();

    // 상단 액션 영역: 실행마감일 - 저장 - 승인요청/상태를 한 줄로 간단히 구성
    var actionHtml = "";
    if(status === "draft"){
      if(canWrite()){
        actionHtml = '<button class="btn" id="btnRequestSiteApproval" type="button">승인요청</button>';
      }
    } else if(status === "pending_approval"){
      actionHtml = '<span class="chip pending">승인 대기중</span>'
        + (S.isPartLeader ? '<button class="btn" id="btnApproveSite" type="button">승인</button>' : '')
        + ((S.isPartLeader||S.isOwner) ? '<button class="btn ghost" id="btnReopenSite" type="button">다시 열기</button>' : '');
    } else if(status === "approved"){
      actionHtml = '<span class="chip approved">승인됨</span>'
        + ((S.isPartLeader||S.isOwner) ? '<button class="btn ghost" id="btnReopenSite" type="button">다시 열기</button>' : '');
    }

    var controlCard = '<div class="detail-card site-control-row">'
      +'<label for="s-deadline-edit">실행 마감일</label>'
      +'<input id="s-deadline-edit" type="date" value="'+esc(s.deadline||"")+'"'+(deadlineEditable?'':' disabled')+'>'
      +(deadlineEditable ? '<button class="btn ghost" id="saveSiteDeadline" type="button">저장</button>' : '')
      +'<span class="row-spacer"></span>'
      +actionHtml
    +'</div>';

    var afterCount = rel.after.length;
    var tabsHtml = "";
    if(s.deadline){
      tabsHtml = '<div class="seg" style="margin-bottom:14px;">'
        +'<button data-site-mode="checklist" class="'+(S.siteViewMode!=="after"?"on":"")+'" type="button">체크리스트 ('+rel.before.length+')</button>'
        +'<button data-site-mode="after" class="'+(S.siteViewMode==="after"?"on":"")+'" type="button">마감 이후 변경'+(afterCount?' ('+afterCount+')':'')+'</button>'
      +'</div>';
    }

    var mode = (s.deadline && S.siteViewMode === "after") ? "after" : "checklist";
    var showCheckbox = mode !== "after";
    var activeList = mode === "after" ? rel.after : rel.before;
    var activeStat = statsForList(activeList, appliedMap);
    var activePct = activeStat.total ? Math.round(activeStat.applied/activeStat.total*100) : 0;
    var activeLocked = mode === "after" ? !canWrite() : (locked || !canWrite());

    var afterNote = "";
    if(mode === "after"){
      afterNote = '<div class="after-heading">⚠️ 실행마감('+fmtDate(s.deadline,deadlinePrecision)+') 이후 변경된 기준</div>'
        +'<div class="after-desc">'+esc(s.name)+'의 실행에는 자동으로 반영되지 않았어요 — 참고용으로만 확인하세요.</div>';
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
        : '<div class="empty">'+(s.deadline ? '실행 마감일 이전 승인된 기준이 없습니다.' : '아직 승인된 실행기준이 없습니다.')+'</div>';
    }

    return '<div class="detail">'
      +'<a class="back-link" href="#/sites">&larr; 현장 목록으로</a>'
      +'<div class="content-head"><div><h1>'+esc(s.name)+'</h1><div class="meta">실행편성 때 반영한 기준을 체크하세요. 체크한 내용은 자동 저장돼요.</div></div></div>'
      +controlCard
      +tabsHtml
      +afterNote
      +progress
      +activeListHtml
    +'</div>';
  }

  function toggleSiteApplied(siteId, changeId, applied){
    if(!S.db){ toast("저장 기능을 사용할 수 없습니다."); return; }
    var patch = { appliedMap:{}, updatedById:S.viewerId, updatedByName:S.viewerName||"", updatedAt: nowIso() };
    patch.appliedMap[changeId] = applied ? { by:S.viewerId, byName:S.viewerName||"", at: nowIso() } : null;
    S.db.doc("sites/"+siteId).update(patch)
      .then(function(){ toast(applied ? "반영 완료로 표시했습니다." : "반영 표시를 해제했습니다."); })
      .catch(function(err){ console.warn(err); toast("저장 중 오류가 발생했습니다."); });
  }

  function requestSiteApproval(id){
    if(!S.db) return;
    var s = S.sites.find(function(x){ return x.id===id; });
    if(!s) return;
    S.db.doc("sites/"+id).update({
      checklistStatus:"pending_approval",
      submittedById:S.viewerId, submittedByName:S.viewerName||"", submittedAt:nowIso()
    }).then(function(){ toast("파트장에게 승인을 요청했습니다."); })
      .catch(function(err){ console.warn(err); toast("요청 중 오류가 발생했습니다."); });
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

  function wireSiteDetail(id){
    document.querySelectorAll(".rowmain[data-open]").forEach(function(el){
      el.addEventListener("click", function(){ location.hash = "#/item/"+el.getAttribute("data-open"); });
    });
    document.querySelectorAll("[data-apply-toggle]").forEach(function(cb){
      cb.addEventListener("change", function(){
        var applied = cb.checked;
        var row = cb.closest(".check-row");
        if(row) row.classList.toggle("applied", applied);
        toggleSiteApplied(id, cb.getAttribute("data-apply-toggle"), applied);
      });
    });
    var saveBtn = document.getElementById("saveSiteDeadline");
    if(saveBtn) saveBtn.addEventListener("click", function(){
      var val = document.getElementById("s-deadline-edit").value;
      if(!S.db){ toast("저장 기능을 사용할 수 없습니다."); return; }
      S.db.doc("sites/"+id).update({ deadline: val, updatedById:S.viewerId, updatedByName:S.viewerName||"", updatedAt: nowIso() })
        .then(function(){ toast("저장되었습니다."); })
        .catch(function(err){ console.warn(err); toast("저장 중 오류가 발생했습니다."); });
    });
    var reqBtn = document.getElementById("btnRequestSiteApproval");
    if(reqBtn) reqBtn.addEventListener("click", function(){ requestSiteApproval(id); });
    var apBtn = document.getElementById("btnApproveSite");
    if(apBtn) apBtn.addEventListener("click", function(){ approveSiteChecklist(id); });
    var reopenBtn = document.getElementById("btnReopenSite");
    if(reopenBtn) reopenBtn.addEventListener("click", function(){ reopenSiteChecklist(id); });
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
    wireRows(); resolveNames();
  }

  boot();
