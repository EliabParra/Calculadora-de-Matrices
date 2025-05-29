const matrixAGrid = document.getElementById('matrix-a-grid');
const matrixBGrid = document.getElementById('matrix-b-grid');
const resultDisplay = document.getElementById('result-display');

const sizeAInput = document.getElementById('size-a');
const sizeBInput = document.getElementById('size-b');

// Botones de operación
const operationButtons = document.querySelectorAll('.operation-btn');
const clearResultBtn = document.getElementById('clear-result-btn');

// Función para crear la estructura de las matrices (siempre cuadradas)
function createMatrixGrid(gridElement, size, prefix) {
    gridElement.innerHTML = '';
    gridElement.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            const input = document.createElement('input');
            input.type = 'number';
            input.className = 'matrix-cell';
            input.id = `${prefix}-${i}-${j}`;
            input.placeholder = '0';
            input.value = '0';
            input.step = '0.01';
            gridElement.appendChild(input);
        }
    }
}

// Inicializar matrices por defecto (3x3)
function initializeMatrices() {
    createMatrixGrid(matrixAGrid, 3, 'matrix-a');
    createMatrixGrid(matrixBGrid, 3, 'matrix-b');
}

// Event listeners para cambios de tamaño
function setupSizeControls() {
    sizeAInput.addEventListener('change', () => {
        const size = parseInt(sizeAInput.value);
        if (size >= 2 && size <= 10) {
            createMatrixGrid(matrixAGrid, size, 'matrix-a');
        } else {
            sizeAInput.value = Math.max(2, Math.min(10, size));
            createMatrixGrid(matrixAGrid, parseInt(sizeAInput.value), 'matrix-a');
        }
    });

    sizeBInput.addEventListener('change', () => {
        const size = parseInt(sizeBInput.value);
        if (size >= 2 && size <= 10) {
            createMatrixGrid(matrixBGrid, size, 'matrix-b');
        } else {
            sizeBInput.value = Math.max(2, Math.min(10, size));
            createMatrixGrid(matrixBGrid, parseInt(sizeBInput.value), 'matrix-b');
        }
    });
}

// Función helper para obtener valores de matriz cuadrada
function getMatrixValues(prefix, size) {
    const matrix = [];
    for (let i = 0; i < size; i++) {
        matrix[i] = [];
        for (let j = 0; j < size; j++) {
            const element = document.getElementById(`${prefix}-${i}-${j}`);
            matrix[i][j] = parseFloat(element.value) || 0;
        }
    }
    return matrix;
}

// Función helper para mostrar mensajes de error
function showError(message) {
    resultDisplay.innerHTML = `
        <div class="error-message">
            <i class="fas fa-exclamation-triangle"></i>
            ${message}
        </div>
    `;
}

// Función helper para mostrar mensajes de éxito
function showSuccess(message) {
    resultDisplay.innerHTML = `
        <div class="success-message">
            <i class="fas fa-check-circle"></i>
            ${message}
        </div>
    `;
}

// Función helper para mostrar información adicional
function showInfo(message) {
    const currentContent = resultDisplay.innerHTML;
    resultDisplay.innerHTML = currentContent + `
        <div class="operation-info">
            <i class="fas fa-info-circle"></i>
            ${message}
        </div>
    `;
}

// Función helper para mostrar matriz en formato bonito
function formatMatrix(matrix) {
    if (!Array.isArray(matrix) || matrix.length === 0) return '';
    
    const maxWidth = Math.max(...matrix.flat().map(val => val.toString().length));
    let result = '';
    
    for (let i = 0; i < matrix.length; i++) {
        result += '[ ';
        for (let j = 0; j < matrix[i].length; j++) {
            const val = parseFloat(matrix[i][j]).toFixed(4).replace(/\.?0+$/, '');
            result += val.padStart(maxWidth, ' ');
            if (j < matrix[i].length - 1) result += '  ';
        }
        result += ' ]\n';
    }
    
    return result;
}

// Función helper para mostrar escalar
function displayScalar(value, operation) {
    resultDisplay.innerHTML = `
        <div class="result-scalar">
            ${operation} = ${parseFloat(value).toFixed(4).replace(/\.?0+$/, '')}
        </div>
    `;
}

// Función helper para validar dimensiones para suma/resta (siempre válidas para matrices cuadradas del mismo tamaño)
function validateSameDimensions(sizeA, sizeB) {
    return sizeA === sizeB;
}

// Función helper para validar multiplicación de matrices (siempre válida para matrices cuadradas del mismo tamaño)
function validateMultiplication(sizeA, sizeB) {
    return sizeA === sizeB;
}

// Función helper para validar matriz cuadrada (siempre verdadero ahora)
function validateSquareMatrix(matrix) {
    return true; // Siempre cuadradas
}

// Función helper para obtener valor escalar
function getScalarValue() {
    const scalarInput = document.getElementById('scalar-input');
    const value = parseFloat(scalarInput.value);
    if (isNaN(value)) {
        showError('Por favor ingresa un valor numérico válido para el escalar');
        return null;
    }
    return value;
}

// Función helper para obtener tamaño de matriz identidad
function getIdentitySize() {
    const identityInput = document.getElementById('identity-size');
    const size = parseInt(identityInput.value);
    if (isNaN(size) || size < 2 || size > 10) {
        showError('El tamaño de la matriz identidad debe estar entre 2 y 10');
        return null;
    }
    return size;
}

// Event listeners para botones de operación
function setupOperationButtons() {
    operationButtons.forEach(button => {
        button.addEventListener('click', () => {
            const operation = button.dataset.operation;
            // Aquí implementarás las operaciones
            console.log(`Operación seleccionada: ${operation}`);
            
            // Ejemplo de estructura para las operaciones:
            // Obtener tamaños de matrices
            const sizeA = parseInt(sizeAInput.value);
            const sizeB = parseInt(sizeBInput.value);
            
            switch(operation) {
                case 'add':
                    // Implementar suma de matrices A + B
                    break;
                case 'subtract-ab':
                    // Implementar resta A - B
                    break;
                case 'subtract-ba':
                    // Implementar resta B - A
                    break;
                case 'multiply':
                    // Implementar multiplicación A × B
                    break;
                case 'scalar-a':
                    // Implementar multiplicación por escalar k × A
                    // const scalar = getScalarValue();
                    // const matrixA = getMatrixValues('matrix-a', sizeA);
                    break;
                case 'scalar-b':
                    // Implementar multiplicación por escalar k × B
                    break;
                case 'transpose-a':
                    // Implementar transposición de matriz A
                    break;
                case 'transpose-b':
                    // Implementar transposición de matriz B
                    break;
                case 'determinant-a':
                    // Implementar determinante de matriz A
                    // const matrixA = getMatrixValues('matrix-a', sizeA);
                    break;
                case 'determinant-b':
                    // Implementar determinante de matriz B
                    break;
                case 'inverse-a':
                    // Implementar inversa de matriz A
                    break;
                case 'inverse-b':
                    // Implementar inversa de matriz B
                    break;
                case 'verify-inverse-a':
                    // Implementar verificación A × A⁻¹ = I
                    break;
                case 'identity':
                    // Implementar generación de matriz identidad
                    // const size = getIdentitySize();
                    break;
                case 'random-fill':
                    // Implementar llenado aleatorio
                    break;
                case 'clear-matrices':
                    // Implementar limpieza de matrices
                    break;
            }
        });
    });
}

// Limpiar resultado
clearResultBtn.addEventListener('click', () => {
    resultDisplay.innerHTML = '<div class="result-placeholder">Selecciona una operación para ver el resultado aquí</div>';
});

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', () => {
    initializeMatrices();
    setupSizeControls();
    setupOperationButtons();
});