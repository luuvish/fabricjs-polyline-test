// Canvas 초기화
const canvas = new fabric.Canvas('canvas', {
    isDrawingMode: false,
    selection: true
});

// 현재 그리고 있는 폴리라인의 점들을 저장할 배열
let points = [];
let isDrawing = false;

// 줌 및 패닝 관련 변수
let currentZoom = 1;
const ZOOM_STEP = 0.1;
const MIN_ZOOM = 0.5;
const MAX_ZOOM = 5;
let isPanning = false;
let lastPosX;
let lastPosY;

// 버튼 요소들
const drawModeBtn = document.getElementById('drawMode');
const selectModeBtn = document.getElementById('selectMode');
const clearBtn = document.getElementById('clear');
const zoomInBtn = document.getElementById('zoomIn');
const zoomOutBtn = document.getElementById('zoomOut');
const resetZoomBtn = document.getElementById('resetZoom');

// 로그 메시지 표시 함수
function addLogMessage(message) {
    const logContainer = document.getElementById('log-messages');
    const logEntry = document.createElement('div');
    logEntry.className = 'log-entry';
    logEntry.textContent = `${new Date().toLocaleTimeString()} - ${message}`;
    logContainer.insertBefore(logEntry, logContainer.firstChild);
    console.log(message);
}

// 줌 기능 함수
function zoomCanvas(zoomFactor) {
    // 현재 줌 레벨 업데이트
    currentZoom = zoomFactor;
    
    // 캔버스 줌 적용
    canvas.setZoom(currentZoom);
    canvas.renderAll();
    
    // 줌 레벨 표시 업데이트
    updateZoomLevelDisplay();
    
    addLogMessage(`줌 레벨: ${Math.round(currentZoom * 100)}%`);
}

// 줌 레벨 표시 업데이트 함수
function updateZoomLevelDisplay() {
    const zoomLevelElement = document.getElementById('zoom-level');
    zoomLevelElement.textContent = `${Math.round(currentZoom * 100)}%`;
}

// 줌인 버튼 이벤트
zoomInBtn.addEventListener('click', function() {
    if (currentZoom < MAX_ZOOM) {
        currentZoom += ZOOM_STEP;
        zoomCanvas(currentZoom);
    }
});

// 줌아웃 버튼 이벤트
zoomOutBtn.addEventListener('click', function() {
    if (currentZoom > MIN_ZOOM) {
        currentZoom -= ZOOM_STEP;
        zoomCanvas(currentZoom);
    }
});

// 줌 리셋 버튼 이벤트
resetZoomBtn.addEventListener('click', function() {
    currentZoom = 1;
    zoomCanvas(currentZoom);
});

// 마우스 휠 줌 이벤트
canvas.on('mouse:wheel', function(opt) {
    const delta = opt.e.deltaY;
    let zoom = canvas.getZoom();
    
    // 마우스 휠 위로 스크롤 시 줌인, 아래로 스크롤 시 줌아웃
    zoom = delta > 0 ? zoom - ZOOM_STEP : zoom + ZOOM_STEP;
    
    // 줌 범위 제한
    if (zoom > MAX_ZOOM) zoom = MAX_ZOOM;
    if (zoom < MIN_ZOOM) zoom = MIN_ZOOM;
    
    // 마우스 포인터 위치를 기준으로 줌
    canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
    
    // 현재 줌 레벨 업데이트
    currentZoom = zoom;
    
    // 줌 레벨 표시 업데이트
    updateZoomLevelDisplay();
    
    // 이벤트 기본 동작 방지 (페이지 스크롤 방지)
    opt.e.preventDefault();
    opt.e.stopPropagation();
    
    addLogMessage(`줌 레벨: ${Math.round(currentZoom * 100)}%`);
});

// 다양한 폴리라인 미리 그리기 함수
function drawSamplePolylines() {
    // 1. 가로 직선
    const horizontalLine = new fabric.Line(
      [100, 100, 300, 100 ]
    , {
        stroke: 'blue',
        strokeWidth: 2,
        padding: 10,
        fill: 'transparent',
        selectable: true,
        hoverCursor: 'pointer',
        perPixelTargetFind: true,
        hasBorders: false,
        hasControls: false
    });
    
    // 2. 세로 직선
    const verticalLine = new fabric.Line(
        [400, 50, 400, 250],
    {
        stroke: 'blue',
        strokeWidth: 2,
        padding: 10,
        fill: 'transparent',
        selectable: true,
        hoverCursor: 'pointer',
        perPixelTargetFind: true,
        hasBorders: false,
        hasControls: false
    });
    
    // 3. 지그재그 선
    const zigzagLine = new fabric.Polyline([
        { x: 500, y: 100 },
        { x: 550, y: 150 },
        { x: 600, y: 100 },
        { x: 650, y: 150 },
        { x: 700, y: 100 }
    ], {
        stroke: 'blue',
        strokeWidth: 2,
        padding: 10,
        fill: 'transparent',
        selectable: true,
        hoverCursor: 'pointer',
        perPixelTargetFind: true,
        hasBorders: false,
        hasControls: false
    });
    
    // 4. 계단형 선
    const stairLine = new fabric.Polyline([
        { x: 100, y: 200 },
        { x: 150, y: 200 },
        { x: 150, y: 250 },
        { x: 200, y: 250 },
        { x: 200, y: 300 },
        { x: 250, y: 300 }
    ], {
        stroke: 'blue',
        strokeWidth: 2,
        padding: 10,
        fill: 'transparent',
        selectable: true,
        hoverCursor: 'pointer',
        perPixelTargetFind: true,
        hasBorders: false,
        hasControls: false
    });
    
    // 5. 다각형 (삼각형)
    const triangle = new fabric.Polyline([
        { x: 350, y: 300 },
        { x: 400, y: 400 },
        { x: 300, y: 400 },
        { x: 350, y: 300 }  // 닫힌 형태를 위해 시작점으로 돌아옴
    ], {
        stroke: 'blue',
        strokeWidth: 2,
        padding: 10,
        fill: 'transparent',
        selectable: true,
        hoverCursor: 'pointer',
        perPixelTargetFind: true,
        hasBorders: false,
        hasControls: false
    });
    
    // 6. 사각형 (직사각형)
    const rectangle = new fabric.Polyline([
        { x: 500, y: 300 },
        { x: 700, y: 300 },
        { x: 700, y: 400 },
        { x: 500, y: 400 },
        { x: 500, y: 300 }  // 닫힌 형태를 위해 시작점으로 돌아옴
    ], {
        stroke: 'blue',
        strokeWidth: 2,
        padding: 10,
        fill: 'transparent',
        selectable: true,
        hoverCursor: 'pointer',
        perPixelTargetFind: true,
        hasBorders: false,
        hasControls: false
    });
    
    // 7. 복잡한 다각형 (별 모양)
    const star = new fabric.Polyline([
        { x: 150, y: 450 },
        { x: 170, y: 500 },
        { x: 220, y: 500 },
        { x: 180, y: 530 },
        { x: 200, y: 580 },
        { x: 150, y: 550 },
        { x: 100, y: 580 },
        { x: 120, y: 530 },
        { x: 80, y: 500 },
        { x: 130, y: 500 },
        { x: 150, y: 450 }
    ], {
        stroke: 'blue',
        strokeWidth: 2,
        padding: 10,
        fill: 'transparent',
        selectable: true,
        hoverCursor: 'pointer',
        perPixelTargetFind: true,
        hasBorders: false,
        hasControls: false
    });
    
    // 8. 곡선 근사 (원 근사)
    const circleApprox = new fabric.Polyline(
        Array.from({ length: 36 }, (_, i) => {
            const angle = i * 10 * Math.PI / 180;
            return { 
                x: 400 + 80 * Math.cos(angle), 
                y: 500 + 80 * Math.sin(angle) 
            };
        }),
        {
            stroke: 'blue',
            strokeWidth: 2,
            padding: 10,
            fill: 'transparent',
            selectable: true,
            hoverCursor: 'pointer',
            perPixelTargetFind: true,
            hasBorders: false,
            hasControls: false
        }
    );
    
    // 9. 물결 모양
    const wave = new fabric.Polyline(
        Array.from({ length: 41 }, (_, i) => {
            return { 
                x: 500 + i * 5, 
                y: 500 + 30 * Math.sin(i * 0.2) 
            };
        }),
        {
            stroke: 'blue',
            strokeWidth: 2,
            padding: 10,
            fill: 'transparent',
            selectable: true,
            hoverCursor: 'pointer',
            perPixelTargetFind: true,
            hasBorders: false,
            hasControls: false
        }
    );
    
    // 모든 폴리라인에 이벤트 추가 및 캔버스에 추가
    [horizontalLine, verticalLine, zigzagLine, stairLine, triangle, rectangle, star, circleApprox, wave].forEach(polyline => {
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
    });
    
    canvas.renderAll();
    addLogMessage('다양한 폴리라인이 그려졌습니다.');
}

// 페이지 로드 시 샘플 폴리라인 그리기
window.addEventListener('load', function() {
    drawSamplePolylines();
    
    // 기본적으로 선택 모드로 시작
    canvas.selection = true;
    canvas.targetFindTolerance = 10;
    canvas.getObjects().forEach(obj => obj.selectable = true);
    
    // 초기 줌 레벨 표시 설정
    updateZoomLevelDisplay();
    
    addLogMessage('선택 모드로 시작합니다.');
});

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
    //canvas.targetFindTolerance = 6;  // 선택 영역의 허용 범위 (픽셀) perPixelTargetFind 옵션과 함께 사용
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

// 패닝 이벤트 (스페이스바 + 마우스 드래그)
document.addEventListener('keydown', function(e) {
    // 스페이스바를 누르면 패닝 모드 활성화
    if (e.code === 'Space') {
        canvas.defaultCursor = 'grab';
        canvas.hoverCursor = 'grab';
        isPanning = true;
        
        // 그리기 모드 일시 중지
        if (!canvas.selection) {
            isDrawing = false;
            points = [];
        }
        
        addLogMessage('패닝 모드 활성화 (스페이스바 + 드래그)');
    }
});

document.addEventListener('keyup', function(e) {
    // 스페이스바를 떼면 패닝 모드 비활성화
    if (e.code === 'Space') {
        canvas.defaultCursor = 'default';
        canvas.hoverCursor = 'default';
        isPanning = false;
        
        addLogMessage('패닝 모드 비활성화');
    }
});

// 마우스 이벤트 처리
canvas.on('mouse:down', function(opt) {
    if (isPanning) {
        this.isDragging = true;
        this.selection = false;
        this.lastPosX = opt.e.clientX;
        this.lastPosY = opt.e.clientY;
        return;
    }
    
    if (!canvas.selection) {  // 그리기 모드일 때만
        isDrawing = true;
        points = [opt.pointer.x, opt.pointer.y];
    }
});

canvas.on('mouse:move', function(opt) {
    if (this.isDragging && isPanning) {
        const e = opt.e;
        const vpt = this.viewportTransform;
        vpt[4] += e.clientX - this.lastPosX;
        vpt[5] += e.clientY - this.lastPosY;
        this.requestRenderAll();
        this.lastPosX = e.clientX;
        this.lastPosY = e.clientY;
        return;
    }
    
    if (isDrawing) {
        points.push(opt.pointer.x, opt.pointer.y);
        
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

canvas.on('mouse:up', function(opt) {
    // 패닝 종료
    this.isDragging = false;
    this.selection = !isPanning && canvas.selection;
    
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