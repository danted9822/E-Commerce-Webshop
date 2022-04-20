import * as yup from 'yup';

export const validationSchema = yup.object({
    fullName: yup.string().required('Full name is required'),
    address1: yup.string().required('Address line 1  is required'),
    address2: yup.string().required('Address line 2  is required'),
    city: yup.string().required(),
    state: yup.string().required(),
    zip: yup.number().typeError('You must specify a number').required(),
    country: yup.string().required('Address line 3  is required'),


})  