const canvas = document.getElementById('circuloCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 400;
canvas.height = 400;

const centroX = canvas.width / 2;
const centroY = canvas.height / 2;
const raio = 150;

function desenharCirculo() {
  ctx.beginPath();
  ctx.arc(centroX, centroY, raio, 0, 2 * Math.PI);
  ctx.strokeStyle = 'white';
  ctx.stroke();

  // Eixos X e Y
  ctx.beginPath();
  ctx.moveTo(centroX, 0);
  ctx.lineTo(centroX, canvas.height);
  ctx.moveTo(0, centroY);
  ctx.lineTo(canvas.width, centroY);
  ctx.strokeStyle = '#aaa';
  ctx.stroke();
}

function atualizarCampos() {
  const modo = document.getElementById('modo').value;
  const inputsDiv = document.getElementById('inputs');
  inputsDiv.innerHTML = '';

  if (modo === 'angulo') {
    inputsDiv.innerHTML = `
      <label for="angulo">Ângulo (graus):</label>
      <input type="number" id="angulo">
    `;
  } else if (modo === 'catetos') {
    inputsDiv.innerHTML = `
      <label for="catetoAdjacente">Cateto adjacente:</label>
      <input type="number" id="catetoAdjacente">
      <label for="catetoOposto">Cateto oposto:</label>
      <input type="number" id="catetoOposto">
    `;
  } else if (modo === 'coordenadas') {
    inputsDiv.innerHTML = `
      <label for="coordenadaX">Coordenada X:</label>
      <input type="number" id="coordenadaX">
      <label for="coordenadaY">Coordenada Y:</label>
      <input type="number" id="coordenadaY">
    `;
  }
}

function calcular() {
  const modo = document.getElementById('modo').value;
  if (modo === 'angulo') {
    calcularPorAngulo();
  } else if (modo === 'catetos') {
    calcularPorCatetos();
  } else if (modo === 'coordenadas') {
    calcularPorCoordenadas();
  }
}

function calcularPorAngulo() {
  let angulo = parseFloat(document.getElementById('angulo').value);
  if (isNaN(angulo)) return;
  
  angulo = ((angulo % 360) + 360) % 360; // normaliza

  const rad = angulo * Math.PI / 180;
  const xUnit = Math.cos(rad);
  const yUnit = Math.sin(rad);

  desenhar(xUnit, yUnit, `Usando ângulo de ${angulo}°`);
}

function calcularPorCatetos() {
  const catetoOposto = parseFloat(document.getElementById('catetoOposto').value);
  const catetoAdjacente = parseFloat(document.getElementById('catetoAdjacente').value);

  if (isNaN(catetoOposto) || isNaN(catetoAdjacente)) return;

  const hipotenusa = Math.sqrt(catetoOposto ** 2 + catetoAdjacente ** 2);

  if (hipotenusa === 0) return;

  const xUnit = catetoAdjacente / hipotenusa;
  const yUnit = catetoOposto / hipotenusa;

  desenhar(xUnit, yUnit, `catAdj/hip = ${xUnit.toFixed(2)} | catOp/hip = ${yUnit.toFixed(2)}`);
}

function calcularPorCoordenadas() {
  const x = parseFloat(document.getElementById('coordenadaX').value);
  const y = parseFloat(document.getElementById('coordenadaY').value);

  if (isNaN(x) || isNaN(y)) return;

  const hipotenusa = Math.sqrt(x ** 2 + y ** 2);

  if (hipotenusa === 0) return;

  const xUnit = x / hipotenusa;
  const yUnit = y / hipotenusa;

  desenhar(xUnit, yUnit, `x/hip = ${xUnit.toFixed(2)} | y/hip = ${yUnit.toFixed(2)}`);
}

function desenhar(xUnit, yUnit, formula) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  desenharCirculo();

  const x = centroX + xUnit * raio;
  const y = centroY - yUnit * raio;

  // Linha do raio (hipotenusa)
  ctx.beginPath();
  ctx.moveTo(centroX, centroY);
  ctx.lineTo(x, y);
  ctx.strokeStyle = 'blue';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Projeção no eixo X (cosseno)
  ctx.beginPath();
  ctx.moveTo(centroX, centroY);
  ctx.lineTo(centroX + xUnit * raio, centroY);
  ctx.strokeStyle = 'red';
  ctx.setLineDash([5, 5]);
  ctx.stroke();

  // Projeção no eixo Y (seno)
  ctx.beginPath();
  ctx.moveTo(centroX + xUnit * raio, centroY);
  ctx.lineTo(x, y);
  ctx.strokeStyle = 'green';
  ctx.stroke();
  ctx.setLineDash([]);

  // Linha da tangente
  if (xUnit !== 0) {
    const tangente = yUnit / xUnit;
    const xTangente = centroX + raio;
    const yTangente = centroY - tangente * raio;

    ctx.beginPath();
    ctx.moveTo(centroX, centroY);
    ctx.lineTo(xTangente, yTangente);
    ctx.strokeStyle = 'orange';
    ctx.stroke();
  }

  // Pontos
  ctx.beginPath();
  ctx.arc(x, y, 4, 0, 2 * Math.PI);
  ctx.fillStyle = 'blue';
  ctx.fill();

  // Mostrar valores
  const tangente = (xUnit !== 0 ? (yUnit / xUnit).toFixed(4) : 'Infinito');
  document.getElementById('resultado').innerHTML = `
    <p><strong>Cos(θ):</strong> ${xUnit.toFixed(4)}</p>
    <p><strong>Sen(θ):</strong> ${yUnit.toFixed(4)}</p>
    <p><strong>Tan(θ):</strong> ${tangente}</p>
    <p><strong>Fórmula usada:</strong> ${formula}</p>
  `;

  // Atualizar valores numéricos
  document.getElementById('valorSeno').textContent = yUnit.toFixed(4);
  document.getElementById('valorCosseno').textContent = xUnit.toFixed(4);
  document.getElementById('valorTangente').textContent = tangente;
}


// Inicializar
desenharCirculo();
atualizarCampos(); // Para mostrar o campo do primeiro modo assim que carregar
