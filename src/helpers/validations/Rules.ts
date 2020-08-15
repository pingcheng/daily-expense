const Rules = {
    required(value: string) {
        return !!value || "Required."
    },

    email(value: string) {
        const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        return pattern.test(value) || 'Invalid e-mail.'
    },

    min7(value: string) {
        return (value && value.length >= 7) || "Minimum 7 characters.";
    }
};

export default Rules;