import 'babel-polyfill'
import Axios from 'axios'
import Domains from './domains'

const form = document.getElementById('email-subscription')
const emailField = document.getElementById('email')
const formError = document.getElementById('form-error')

let submitting = false

const baseEmailParams = {
    publicAccountID: '29a224de-bf46-43b2-8038-bb48165bb30d',
    publicListID: 'dfa729e1-4545-47de-9268-44c9ec8c53f5',
    sendActivation: false
}

const getUrlParams = (search) => {
    let hashes = search.slice(search.indexOf('?') + 1).split('&')
    let params = {}
    hashes.map((hash) => {
        let [key, val] = hash.split('=')
        params[key] = decodeURIComponent(val)
    })

    return params
}

if (document.getElementsByTagName('body')[0].classList.contains('rsvp')) {
    const params = getUrlParams(window.location.search)
    const rsvpResponse = document.getElementById('rsvp-response')

    const processRSVP = async ({ email, rsvp }) => {
        try {
            const { data } = await Axios.get('https://api.elasticemail.com/v2/contact/add', {
                params: {
                    ...baseEmailParams,
                    email,
                    field_march_2019: rsvp
                }
            })

            if (!data.success) {
                throw new Error('Sorry, we have not been able to process your RSVP.')
            }

            let message = 'Thank you for letting us know that you’re coming, we’re looking forward to seeing you.'

            if (rsvp === 0) {
                message = 'Thank you for letting us know that you won’t be coming. See you next time hopefully!'
            }
            else if (rsvp === 1) {
                message = 'Thank you for letting us know that you might be coming.'
            }

            rsvpResponse.innerHTML = message
        }
        catch (err) {
            rsvpResponse.innerHTML = err.message
        }
    }

    if (params.rsvp && params.email) {
        params.rsvp = parseInt(params.rsvp, 10)
        processRSVP(params)
    }
    else {
        rsvpResponse.innerHTML = "Sorry, looks like this link is not formatted properly. Get in touch at hello@diacritics.club if you're having some trouble."
    }
}
else {
    form.addEventListener('submit', async (ev) => {
        ev.preventDefault()

        if (!submitting) {
            submitting = true
            form.classList.remove('error')
            form.classList.add('submitting')

            try {
                const email = emailField.value
                const emailParts = email.split(/@/)
                const domain = emailParts[1] || ''
                const extension = domain.split('.')

                if (!email) {
                    throw new Error('Oh no! There doesn’t seem to be an email there...')
                }
                else if (!emailField.checkValidity() || extension.length < 2) {
                    throw new Error('Oh no! Your email appears to be invalid.')
                }
                else if (Domains.includes(domain)) {
                    throw new Error('Oh no! Your email appears to come from a spam domain. Better double check.')
                }

                const { data } = await Axios.get('https://api.elasticemail.com/v2/contact/add', {
                    params: {
                        ...baseEmailParams,
                        email
                    }
                })

                if (!data.success) {
                    throw new Error('Oh no! Our mailing list seems to be having a little crisis. Try again maybe?')
                }

                form.classList.add('success')
            }
            catch (err) {
                form.classList.add('error')
                formError.innerHTML = err.message
                submitting = false
                form.classList.remove('submitting')
            }
        }
    })
}
