// Canvas 초기화
const canvas = new fabric.Canvas('canvas', {
    isDrawingMode: false,
    selection: true
});

// 현재 그리고 있는 폴리라인의 점들을 저장할 배열
let points = [];
let isDrawing = false;

// 버튼 요소들
const drawModeBtn = document.getElementById('drawMode');
const selectModeBtn = document.getElementById('selectMode');
const clearBtn = document.getElementById('clear');

// 로그 메시지 표시 함수
function addLogMessage(message) {
    const logContainer = document.getElementById('log-messages');
    const logEntry = document.createElement('div');
    logEntry.className = 'log-entry';
    logEntry.textContent = `${new Date().toLocaleTimeString()} - ${message}`;
    logContainer.insertBefore(logEntry, logContainer.firstChild);
    console.log(message);
}

// 그리기 모드 활성화
drawModeBtn.addEventListener('click', function() {
    canvas.selection = false;
    canvas.targetFindTolerance = 1;
    isDrawing = false;
    points = [];
    canvas.getObjects().forEach(obj => obj.selectable = false);
    addLogMessage('그리기 모드로 전환되었습니다.');
});

// 선택 모드 활성화
selectModeBtn.addEventListener('click', function() {
    canvas.selection = true;
    canvas.targetFindTolerance = 6;  // 선택 영역의 허용 범위 (픽셀) perPixelTargetFind 옵션과 함께 사용
    isDrawing = false;
    points = [];
    canvas.getObjects().forEach(obj => obj.selectable = true);
    addLogMessage('선택 모드로 전환되었습니다.');
});

// 캔버스 초기화
clearBtn.addEventListener('click', function() {
    canvas.clear();
    points = [];
    isDrawing = false;
    addLogMessage('캔버스가 초기화되었습니다.');
});

// 마우스 이벤트 처리
canvas.on('mouse:down', function(options) {
    if (!canvas.selection) {  // 그리기 모드일 때만
        isDrawing = true;
        points = [options.pointer.x, options.pointer.y];
    }
});

canvas.on('mouse:move', function(options) {
    if (isDrawing) {
        points.push(options.pointer.x, options.pointer.y);
        
        // 기존 임시 선 삭제
        const objects = canvas.getObjects();
        if (objects.length > 0 && objects[objects.length - 1].tempLine) {
            canvas.remove(objects[objects.length - 1]);
        }
        
        // 새로운 임시 선 그리기
        const polyline = new fabric.Polyline(
            points.reduce((arr, val, i) => {
                if (i % 2 === 0) arr.push({ x: val, y: points[i + 1] });
                return arr;
            }, []),
            {
                stroke: 'red',
                strokeWidth: 2,
                fill: 'transparent',
                selectable: false,
                tempLine: true
            }
        );
        canvas.add(polyline);
        canvas.renderAll();
    }
});

canvas.on('mouse:up', function() {
    if (isDrawing) {
        // 기존 임시 선 삭제
        const objects = canvas.getObjects();
        if (objects.length > 0 && objects[objects.length - 1].tempLine) {
            canvas.remove(objects[objects.length - 1]);
        }
        
        // 최종 폴리라인 생성
        const polyline = new fabric.Polyline(
            points.reduce((arr, val, i) => {
                if (i % 2 === 0) arr.push({ x: val, y: points[i + 1] });
                return arr;
            }, []),
            {
                stroke: 'blue',
                strokeWidth: 2,
                fill: 'transparent',
                selectable: true,
                hoverCursor: 'pointer',
                perPixelTargetFind: true,  // 픽셀 단위로 선택 영역 확인
                hasBorders: false,         // 선택 시 테두리 제거
                hasControls: false         // 선택 시 컨트롤 포인트 제거
            }
        );
        
        // 선택 이벤트 추가
        polyline.on('selected', function() {
            addLogMessage('폴리라인이 선택되었습니다!');
            this.set('stroke', 'green');
            canvas.renderAll();
        });
        
        polyline.on('deselected', function() {
            addLogMessage('폴리라인 선택이 해제되었습니다!');
            this.set('stroke', 'blue');
            canvas.renderAll();
        });
        
        canvas.add(polyline);
        canvas.renderAll();
        
        // 그리기 상태 초기화
        isDrawing = false;
        points = [];
    }
}); 