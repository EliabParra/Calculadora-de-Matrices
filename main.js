const $ = $ => {return document.querySelector($)}
const $$ = $$ => {return document.querySelectorAll($$)}

const matrixAGrid = $('#matrix-a-grid')
const matrixBGrid = $('#matrix-b-grid')
const resultDisplay = $('#result-display')

const sizeAInput = $('#size-a')
const sizeBInput = $('#size-b')

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
                    // matrixA[0][0] * matrixB[0][0] + matrixA[0][1] * matrixB[1][0] + matrixA[0][2] * matrixB[2][0]
                    // matrixA[0][0] * matrixB[0][1] + matrixA[0][1] * matrixB[1][1] + matrixA[0][2] * matrixB[2][1]
                    // matrixA[0][0] * matrixB[0][2] + matrixA[0][1] * matrixB[1][2] + matrixA[0][2] * matrixB[2][2]

                    

                    // matrixA[i][j] * matrixB[j][i] + matrixA[i][j+1] * matrixB[j+1][i] + matrixA[i][j+2] * matrixB[j+2][i]
                    // (3) [-2, -7, 1] ,  0
                    // (3) [-8, 9, -9] ,  1
                    // (3) [7, 0, -7] ,  2
                    // 1 ,  0
                    // -5 ,  1
                    // -5 ,  2
                    // -1 ,  0
                    // -9 ,  1
                    // -1 ,  2
                    // 1 ,  0
                    // 3 ,  1
                    // 0 ,  2
                    const resultMatrixMultiplyAB = matrixA.map((row, i) => {
                        row.map((val, j) => {
                            matrixA[j][i] * matrixB[i][j] + matrixA[j][i+1] * matrixB[i+1][j] + matrixA[j][i+2] * matrixB[i+2][j]
                        })
                    })
                    console.log(resultMatrixMultiplyAB);
                    break
                case 'multiply-ba':
                    
                    break
                case 'scalar-a':
                    // Implementar multiplicación por escalar k × A
                    break
                case 'scalar-b':
                    // Implementar multiplicación por escalar k × B
                    break
                case 'transpose-a':
                    // Implementar transposición de matriz A
                    break
                case 'transpose-b':
                    // Implementar transposición de matriz B
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