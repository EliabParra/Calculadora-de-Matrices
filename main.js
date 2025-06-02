const $ = $ => {return document.querySelector($)}
const $$ = $$ => {return document.querySelectorAll($$)}

const matrixAGrid = $('#matrix-a-grid')
const matrixBGrid = $('#matrix-b-grid')
const resultDisplay = $('#result-display')

const sizeAInput = $('#size-a')
const sizeBInput = $('#size-b')

const scalarInput = $('#scalar-input')

// Botones de operación
const operationButtons = $$('.operation-btn')
const clearResultBtn = $('#clear-result-btn')

// Función para crear la estructura de las matrices (siempre cuadradas)
function createMatrixGrid(gridElement, size, prefix) {
    gridElement.innerHTML = ''
    gridElement.style.gridTemplateColumns = `repeat(${size}, 1fr)`
    
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            const input = document.createElement('input')
            input.type = 'number'
            input.className = 'matrix-cell'
            input.id = `${prefix}-${i}-${j}`
            input.placeholder = '0'
            input.value = '0'
            input.step = '1'
            gridElement.appendChild(input)
        }
    }
}

// Inicializar matrices por defecto (3x3)
function initializeMatrices() {
    createMatrixGrid(matrixAGrid, 3, 'matrix-a')
    createMatrixGrid(matrixBGrid, 3, 'matrix-b')
}

// Event listeners para cambios de tamaño
function setupSizeControls() {
    sizeAInput.addEventListener('change', () => {
        const size = parseInt(sizeAInput.value)
        if (size >= 2 && size <= 10) {
            createMatrixGrid(matrixAGrid, size, 'matrix-a')
        } else {
            sizeAInput.value = Math.max(2, Math.min(10, size))
            createMatrixGrid(matrixAGrid, parseInt(sizeAInput.value), 'matrix-a')
        }
    })

    sizeBInput.addEventListener('change', () => {
        const size = parseInt(sizeBInput.value)
        if (size >= 2 && size <= 10) {
            createMatrixGrid(matrixBGrid, size, 'matrix-b')
        } else {
            sizeBInput.value = Math.max(2, Math.min(10, size))
            createMatrixGrid(matrixBGrid, parseInt(sizeBInput.value), 'matrix-b')
        }
    })
}

// Función helper para obtener valores de matriz cuadrada
function getMatrixValues(prefix, size) {
    const matrix = []
    for (let i = 0; i < size; i++) {
        matrix[i] = []
        for (let j = 0; j < size; j++) {
            const element = $(`#${prefix}-${i}-${j}`)
            matrix[i][j] = parseFloat(element.value) || 0
        }
    }
    return matrix
}

// Función helper para mostrar mensajes de error
function showError(message) {
    resultDisplay.innerHTML = `
        <div class="error-message">
            <i class="fas fa-exclamation-triangle"></i>
            ${message}
        </div>
    `
}

// Función helper para mostrar mensajes de éxito
function showSuccess(message) {
    resultDisplay.innerHTML = `
        <div class="success-message">
            <i class="fas fa-check-circle"></i>
            ${message}
        </div>
    `
}

// Función helper para mostrar matriz en formato bonito
function formatMatrix(matrix) {
    if (!Array.isArray(matrix) || matrix.length === 0) return ''
    
    const maxWidth = Math.max(...matrix.flat().map(val => val.toString().length))
    let result = ''
    
    for (let i = 0; i < matrix.length; i++) {
        result += '[ '
        for (let j = 0; j < matrix[i].length; j++) {
            const val = parseFloat(matrix[i][j]).toFixed(4).replace(/\.?0+$/, '')
            result += val.padStart(maxWidth, ' ')
            if (j < matrix[i].length - 1) result += '  '
        }
        result += ' ]\n'
    }
    
    return result
}

// Función helper para mostrar escalar
function displayScalar(value, operation) {
    resultDisplay.innerHTML = `
        <div class="result-scalar">
            ${operation} = ${parseFloat(value).toFixed(4).replace(/\.?0+$/, '')}
        </div>
    `
}

// Función helper para validar dimensiones para suma/resta/multiplicacion (siempre válidas para matrices cuadradas del mismo tamaño)
function validateSameDimensions(sizeA, sizeB) {
    return sizeA === sizeB
}

// Función helper para obtener valor escalar
function getScalarValue() {
    const scalarInput = $('#scalar-input')
    const value = parseFloat(scalarInput.value)
    if (isNaN(value)) {
        showError('Por favor ingresa un valor numérico válido para el escalar')
        return null
    }
    return value
}

// Función helper para obtener tamaño de matriz identidad
function getIdentitySize() {
    const identityInput = $('#identity-size')
    const size = parseInt(identityInput.value)
    if (isNaN(size) || size < 2 || size > 10) {
        showError('El tamaño de la matriz identidad debe estar entre 2 y 10')
        return null
    }
    return size
}

// Event listeners para botones de operación
function setupOperationButtons() {
    operationButtons.forEach(button => {
        button.addEventListener('click', () => {
            const operation = button.dataset.operation
            // Aquí implementarás las operaciones
            console.log(`Operación seleccionada: ${operation}`)
            
            // Ejemplo de estructura para las operaciones:
            // Obtener tamaños de matrices
            const sizeA = parseInt(sizeAInput.value)
            const sizeB = parseInt(sizeBInput.value)

            const matrixA = getMatrixValues('matrix-a', sizeA)
            const matrixB = getMatrixValues('matrix-b', sizeB)
            
            switch(operation) {
                case 'add':
                    if (!validateSameDimensions(sizeA, sizeB)) {
                        showError('Las matrices A y B deben tener el mismo tamaño para la suma')
                        return
                    }
                    const resultMatrixAdd = matrixA.map((row, i) => row.map((val, j) => val + matrixB[i][j]))
                    resultDisplay.innerHTML = `<pre>${formatMatrix(resultMatrixAdd)}</pre>`
                    break
                case 'subtract-ab':
                    if (!validateSameDimensions(sizeA, sizeB)) {
                        showError('Las matrices A y B deben tener el mismo tamaño para la resta')
                        return
                    }
                    const resultMatrixSubstractAB = matrixA.map((row, i) => row.map((val, j) => val - matrixB[i][j]))
                    resultDisplay.innerHTML = `<pre>${formatMatrix(resultMatrixSubstractAB)}</pre>`
                    break
                case 'subtract-ba':
                    if (!validateSameDimensions(sizeA, sizeB)) {
                        showError('Las matrices A y B deben tener el mismo tamaño para la resta')
                        return
                    }
                    const resultMatrixSubstractBA = matrixB.map((row, i) => row.map((val, j) => val - matrixA[i][j]))
                    resultDisplay.innerHTML = `<pre>${formatMatrix(resultMatrixSubstractBA)}</pre>`
                    break
                case 'multiply-ab':
                    if (!validateSameDimensions(sizeA, sizeB)) {
                        showError('Las matrices A y B al ser cuadradas deben tener el mismo tamaño para la multiplicación')
                        return
                    }
                    const resultMatrixMultiplyAB = Array.from({ length: sizeA }, () => Array(sizeB).fill(0))
                    for (let i = 0; i < sizeA; i++) {
                        for (let j = 0; j < sizeB; j++) {
                            for (let k = 0; k < sizeA; k++) {
                                resultMatrixMultiplyAB[i][j] += matrixA[i][k] * matrixB[k][j]
                            }
                        }
                    }
                    resultDisplay.innerHTML = `<pre>${formatMatrix(resultMatrixMultiplyAB)}</pre>`
                    break
                case 'multiply-ba':
                    const resultMatrixMultiplyBA = Array.from({ length: sizeB }, () => Array(sizeA).fill(0))
                    for (let i = 0; i < sizeB; i++) {
                        for (let j = 0; j < sizeA; j++) {
                            for (let k = 0; k < sizeB; k++) {
                                resultMatrixMultiplyBA[i][j] += matrixB[i][k] * matrixA[k][j]
                            }
                        }
                    }
                    resultDisplay.innerHTML = `<pre>${formatMatrix(resultMatrixMultiplyBA)}</pre>`
                    break
                case 'scalar-a':
                    const scalarA = parseFloat(scalarInput.value)
                    if (isNaN(scalarA)) {
                        showError('El valor del escalar no es válido')
                        return
                    }
                    const resultMatrixScalarA = matrixA.map(row => row.map(val => val * scalarA))
                    resultDisplay.innerHTML = `<pre>${formatMatrix(resultMatrixScalarA)}</pre>`
                    break
                case 'scalar-b':
                    const scalarB = parseFloat(scalarInput.value)
                    if (isNaN(scalarB)) {
                        showError('El valor del escalar no es válido')
                        return
                    }
                    const resultMatrixScalarB = matrixB.map(row => row.map(val => val * scalarB))
                    resultDisplay.innerHTML = `<pre>${formatMatrix(resultMatrixScalarB)}</pre>`
                    break
                case 'transpose-a':
                    const matrixATranspose = matrixA.map((row, i) => row.map((val, j) => val = matrixA[j][i]))
                    resultDisplay.innerHTML = `<pre>${formatMatrix(matrixATranspose)}</pre>`
                    break
                case 'transpose-b':
                    const matrixBTranspose = matrixB.map((row, i) => row.map((val, j) => val = matrixB[j][i]))
                    resultDisplay.innerHTML = `<pre>${formatMatrix(matrixBTranspose)}</pre>`
                    break
                case 'determinant-a':
                    // Implementar determinante de matriz A
                    break
                case 'determinant-b':
                    // Implementar determinante de matriz B
                    break
                case 'inverse-a':
                    // Implementar inversa de matriz A
                    break
                case 'inverse-b':
                    // Implementar inversa de matriz B
                    break
                case 'verify-inverse-a':
                    // Implementar verificación A × A⁻¹ = I
                    break
                case 'identity':
                    // Implementar generación de matriz identidad
                    break
                case 'random-fill':
                    for (let i = 0; i < sizeA; i++) {
                        for (let j = 0; j < sizeA; j++) {
                            const randomValueA = Math.round(Math.random() * 20 - 10)
                            $(`#matrix-a-${i}-${j}`).value = randomValueA
                        }
                    }
                    for (let i = 0; i < sizeB; i++) {
                        for (let j = 0; j < sizeB; j++) {
                            const randomValueB = Math.round(Math.random() * 20 - 10)
                            $(`#matrix-b-${i}-${j}`).value = randomValueB
                        }
                    }
                    showSuccess('Matrices A y B llenadas con valores aleatorios entre -10 y 10')
                    break
                case 'clear-matrices':
                    initializeMatrices()
                    showSuccess('Matrices A y B reinicializadas a 3x3 con valores por defecto')
                    break
            }
        })
    })
}

// Limpiar resultado
clearResultBtn.addEventListener('click', () => {
    resultDisplay.innerHTML = '<div class="result-placeholder">Selecciona una operación para ver el resultado aquí</div>'
})

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', () => {
    initializeMatrices()
    setupSizeControls()
    setupOperationButtons()
})