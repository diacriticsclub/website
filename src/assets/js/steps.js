import "babel-polyfill"
import $ from 'jquery'

window.jQuery = window.$ = $

const calculate = () => {
    const start = parseInt($('#start-value').val(), 10)
    const end = parseInt($('#end-value').val(), 10)
    const nbSteps = parseInt($('#nb-steps').val(), 10)

    const weights = []

    for (let step = 1; step <= nbSteps; step++) {
        const linear = Math.round((end - start) / (nbSteps - 1) * (step - 1) + start)
        const lucas = Math.round(start * Math.pow(end / start, (step - 1) / (nbSteps - 1)))
        const impallari = Math.round((step - 1) / (nbSteps - 1) * linear + (nbSteps - step) / (nbSteps - 1) * lucas)

        weights.push({ linear, lucas, impallari })
    }

    $('.result ul').html('')

    weights.forEach(({ linear, lucas, impallari }) => {
        $('.result.linear ul').append(`<li><div class="bar" style="width: ${linear/5}px; height: ${linear}px;"></div> <div class="value">${linear}</div></li>`)
        $('.result.lucas ul').append(`<li><div class="bar" style="width: ${lucas/5}px; height: ${lucas}px;"></div> <div class="value">${lucas}</div></li>`)
        $('.result.impallari ul').append(`<li><div class="bar" style="width: ${impallari/5}px; height: ${impallari}px;"></div> <div class="value">${impallari}</div></li>`)
    })
}

$('#family-steps').on('submit', (ev) => {
    ev.preventDefault()
    calculate()    
})

calculate()
