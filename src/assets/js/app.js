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