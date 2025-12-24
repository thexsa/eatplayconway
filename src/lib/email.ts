import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendEmail({
    to,
    subject,
    html
}: {
    to: string
    subject: string
    html: string
}) {
    if (!process.env.RESEND_API_KEY) {
        console.warn('RESEND_API_KEY is not set. Skipping email.')
        return
    }

    try {
        const { data, error } = await resend.emails.send({
            from: 'Eat Play Conway <onboarding@resend.dev>', // Should be verified domain in production
            to,
            subject,
            html,
        })

        if (error) {
            console.error('Email send error:', error)
            throw error
        }

        return data
    } catch (error) {
        console.error('Email caught error:', error)
    }
}
