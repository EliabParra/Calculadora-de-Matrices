const $ = $ => {return document.querySelector($)}
const $$ = $$ => {return document.querySelectorAll($$)}

const matrixAGrid = $('#matrix-a-grid')
const matrixBGrid = $('#matrix-b-grid')
const resultDisplay = $('#result-display')

const sizeAInput = $('#size-a')
const sizeBInput = $('#size-b')

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
    sizeAInput.value = 3
    sizeBInput.value = 3
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

// Función para obtener valores de matriz cuadrada
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

// Función para mostrar mensajes de error
function showError(message) {
    resultDisplay.innerHTML = `
        <div class="error-message">
            <i class="fas fa-exclamation-triangle"></i>
            ${message}
        </div>
    `
}

// Función para mostrar mensajes de éxito
function showSuccess(message) {
    resultDisplay.innerHTML = `
        <div class="success-message">
            <i class="fas fa-check-circle"></i>
            ${message}
        </div>
    `
}

// Función para mostrar matriz formateada
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

// Función para mostrar escalar
function displayScalar(value, operation) {
    resultDisplay.innerHTML = `
        <div class="result-scalar">
            ${operation} = ${parseFloat(value).toFixed(4).replace(/\.?0+$/, '')}
        </div>
    `
}

// Función para validar dimensiones para suma/resta/multiplicacion (siempre válidas para matrices cuadradas del mismo tamaño)
function validateSameDimensions(sizeA, sizeB) {
    return sizeA === sizeB
}

// Función para obtener valor escalar
function getScalarValue() {
    const scalarInput = $('#scalar-input')
    const value = parseFloat(scalarInput.value)
    if (isNaN(value)) {
        showError('Por favor ingresa un valor numérico válido para el escalar')
        return null
    }
    return value
}

// Función para obtener tamaño de matriz identidad
function getIdentitySize() {
    const identityInput = $('#identity-size')
    const size = parseInt(identityInput.value)
    if (isNaN(size) || size < 2 || size > 10) {
        showError('El tamaño de la matriz identidad debe estar entre 2 y 10')
        return null
    }
    return size
}

// Funcion para calcular el determinante de una matriz cuadrada usando cofactores
function determinant(matrix) {
    const n = matrix.length

    // Caso base: matriz 1x1
    if (n === 1) return matrix[0][0]

    // Caso base: matriz 2x2
    if (n === 2) return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0]

    // Caso general: matriz nxn, usa cofactores
    let det = 0
    for (let col = 0; col < n; col++) {
        // Construir submatriz (elimina fila 0 y columna 'col')
        const subMatrix = []
        for (let i = 1; i < n; i++) {
            const row = []
            for (let j = 0; j < n; j++) {
                if (j !== col) row.push(matrix[i][j])
            }
            subMatrix.push(row)
        }
        // Suma o resta según el signo alternante
        det += ((col % 2 === 0 ? 1 : -1) * matrix[0][col] * determinant(subMatrix))
    }
    return det
}

// Función para multiplicar matrices
function multiplyMatrices(matrixA, matrixB) {
    if (matrixA[0].length !== matrixB.length) {
        showError('Las matrices no se pueden multiplicar: las columnas de A deben coincidir con las filas de B')
        return null
    }

    const resultMatrix = Array.from({ length: matrixA.length }, () => Array(matrixB[0].length).fill(0))
    for (let i = 0; i < matrixA.length; i++) {
        for (let j = 0; j < matrixB[0].length; j++) {
            for (let k = 0; k < matrixA[0].length; k++) {
                resultMatrix[i][j] += matrixA[i][k] * matrixB[k][j]
            }
        }
    }
    return resultMatrix
}

// Función para calcular la adjunta de una matriz cuadrada
function adjugate(matrix) {
    const n = matrix.length
    const adj = Array.from({ length: n }, () => Array(n).fill(0))

    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            // Construir submatriz eliminando fila i y columna j
            const subMatrix = []
            for (let row = 0; row < n; row++) {
                if (row === i) continue
                const subRow = []
                for (let col = 0; col < n; col++) {
                    if (col === j) continue
                    subRow.push(matrix[row][col])
                }
                subMatrix.push(subRow)
            }
            adj[j][i] = ((i + j) % 2 === 0) ? 1 : -1 * determinant(subMatrix)
        }
    }
    return adj
}

// Funcion para calcular la traspuesta de una matriz cuadrada
function transpose(matrix) {
    return matrix.map((row, i) => row.map((val, j) => val = matrix[j][i]))
}

// Función para calcular inversa
function inverseMatrix(matrix) {
    const n = matrix.length
    const det = determinant(matrix)
    
    // Si el determinante es 0, la matriz no es invertible
    if (Math.abs(det) < 0.0001) {
        return null
    }
    
    let adjugate = []
    for (let x = 0; x < n; x++) {
        adjugate[x] = []
    }
    
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            // Hacer matriz pequeña sin fila i y columna j
            let subMatrix = []
            for (let x = 0; x < n; x++) {
                if (x !== i) {
                    let row = []
                    for (let y = 0; y < n; y++) {
                        if (y !== j) {
                            row.push(matrix[x][y])
                        }
                    }
                    subMatrix.push(row)
                }
            }
            
            // Calcular cofactor
            let cofactor = determinant(subMatrix)
            if ((i + j) % 2 === 1) {
                cofactor = -cofactor
            }
            
            // Poner en posición traspuesta
            adjugate[j][i] = cofactor
        }
    }
    
    // Dividir por determinante
    let inverse = []
    for (let i = 0; i < n; i++) {
        inverse[i] = []
        for (let j = 0; j < n; j++) {
            inverse[i][j] = Number((adjugate[i][j] / det).toFixed(4))
        }
    }
    
    return inverse
}

// Función simple para verificar identidad
function isIdentity(matrix) {
    const n = matrix.length
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            if (i === j) {
                // Debe ser 1 en la diagonal
                if (Math.abs(matrix[i][j] - 1) > 0.01) {
                    return false
                }
            } else {
                // Debe ser 0 fuera de la diagonal
                if (Math.abs(matrix[i][j]) > 0.01) {
                    return false
                }
            }
        }
    }
    return true
}

// Event listeners para botones de operación
function setupOperationButtons() {
    operationButtons.forEach(button => {
        button.addEventListener('click', () => {
            const operation = button.dataset.operation
            console.log(`Operación seleccionada: ${operation}`)
            
            const sizeA = parseInt(sizeAInput.value)
            const sizeB = parseInt(sizeBInput.value)

            const matrixA = getMatrixValues('matrix-a', sizeA)
            const matrixB = getMatrixValues('matrix-b', sizeB)
            
            switch(operation) {
                case 'add':
                    if (!validateSameDimensions(sizeA, sizeB)) {
                        showError('Las matrices A y B deben tener el mismo tamaño para la suma')
                        break
                    }
                    const resultMatrixAdd = matrixA.map((row, i) => row.map((val, j) => val + matrixB[i][j]))
                    resultDisplay.innerHTML = `<pre>${formatMatrix(resultMatrixAdd)}</pre>`
                    break
                case 'subtract-ab':
                    if (!validateSameDimensions(sizeA, sizeB)) {
                        showError('Las matrices A y B deben tener el mismo tamaño para la resta')
                        break
                    }
                    const resultMatrixSubstractAB = matrixA.map((row, i) => row.map((val, j) => val - matrixB[i][j]))
                    resultDisplay.innerHTML = `<pre>${formatMatrix(resultMatrixSubstractAB)}</pre>`
                    break
                case 'subtract-ba':
                    if (!validateSameDimensions(sizeA, sizeB)) {
                        showError('Las matrices A y B deben tener el mismo tamaño para la resta')
                        break
                    }
                    const resultMatrixSubstractBA = matrixB.map((row, i) => row.map((val, j) => val - matrixA[i][j]))
                    resultDisplay.innerHTML = `<pre>${formatMatrix(resultMatrixSubstractBA)}</pre>`
                    break
                case 'multiply-ab':
                    const resultMatrixMultiplyAB = multiplyMatrices(matrixA, matrixB)
                    if (resultMatrixMultiplyAB === null) break
                    resultDisplay.innerHTML = `<pre>${formatMatrix(resultMatrixMultiplyAB)}</pre>`
                    break
                case 'multiply-ba':
                    const resultMatrixMultiplyBA = multiplyMatrices(matrixB, matrixA)
                    if (resultMatrixMultiplyBA === null) break
                    resultDisplay.innerHTML = `<pre>${formatMatrix(resultMatrixMultiplyBA)}</pre>`
                    break
                case 'scalar-a':
                    const scalarA = getScalarValue()
                    const resultMatrixScalarA = matrixA.map(row => row.map(val => val * scalarA))
                    resultDisplay.innerHTML = `<pre>${formatMatrix(resultMatrixScalarA)}</pre>`
                    break
                case 'scalar-b':
                    const scalarB = getScalarValue()
                    const resultMatrixScalarB = matrixB.map(row => row.map(val => val * scalarB))
                    resultDisplay.innerHTML = `<pre>${formatMatrix(resultMatrixScalarB)}</pre>`
                    break
                case 'transpose-a':
                    const matrixATranspose = transpose(matrixA)
                    resultDisplay.innerHTML = `<pre>${formatMatrix(matrixATranspose)}</pre>`
                    break
                case 'transpose-b':
                    const matrixBTranspose = transpose(matrixB)
                    resultDisplay.innerHTML = `<pre>${formatMatrix(matrixBTranspose)}</pre>`
                    break
                case 'determinant-a':
                    const detA = determinant(matrixA)
                    displayScalar(detA, 'det(A)')
                    break
                case 'determinant-b':
                    const detB = determinant(matrixB)
                    displayScalar(detB, 'det(B)')
                    break
                case 'inverse-a':
                    const invA = inverseMatrix(matrixA)
                    if (invA === null) {
                        showError('La matriz A no se puede invertir (determinante = 0)')
                        break
                    }
                    resultDisplay.innerHTML = `<pre>${formatMatrix(invA)}</pre>`
                    break
                case 'inverse-b':
                    const invB = inverseMatrix(matrixB)
                    if (invB === null) {
                        showError('La matriz B no es invertible')
                        break
                    }
                    resultDisplay.innerHTML = `<pre>${formatMatrix(invB)}</pre>`
                    break
                case 'verify-inverse-a':
                    const invA2 = inverseMatrix(matrixA)
                    if (invA2 === null) {
                        showError('La matriz A no es invertible')
                        break
                    }
                    const productAInvA = multiplyMatrices(matrixA, invA2).map(row => row.map(val => parseFloat(val.toFixed(4))))
                    if (isIdentity(productAInvA)) {
                        showSuccess('¡La multiplicación A × A⁻¹ da la matriz identidad!')
                    } else {
                        showError('La multiplicación A × A⁻¹ NO da la matriz identidad')
                    }
                    resultDisplay.innerHTML += `<pre>${formatMatrix(productAInvA)}</pre>`
                    break
                case 'verify-inverse-b':
                    const invB2 = inverseMatrix(matrixB)
                    if (invB2 === null) {
                        showError('La matriz B no es invertible')
                        break
                    }
                    const productBInvB = multiplyMatrices(matrixB, invB2).map(row => row.map(val => parseFloat(val.toFixed(4))))
                    if (isIdentity(productBInvB)) {
                        showSuccess('¡La multiplicación B × B⁻¹ da la matriz identidad!')
                    } else {
                        showError('La multiplicación B × B⁻¹ NO da la matriz identidad')
                    }
                    resultDisplay.innerHTML += `<pre>${formatMatrix(productBInvB)}</pre>`
                    break
                case 'identity':
                    const identitySize = getIdentitySize()
                    const identityMatrix = Array.from({ length: identitySize }, () => Array(identitySize).fill(0))
                    for (let i = 0; i < identitySize; i++) {
                        identityMatrix[i][i] = 1
                    }
                    resultDisplay.innerHTML = `<pre>${formatMatrix(identityMatrix)}</pre>`
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

document.addEventListener('DOMContentLoaded', () => {
    initializeMatrices()
    setupSizeControls()
    setupOperationButtons()
})