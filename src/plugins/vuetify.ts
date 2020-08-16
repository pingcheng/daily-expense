import Vue from 'vue';
import Vuetify from 'vuetify';

Vue.use(Vuetify);

export default new Vuetify({
});

export type VForm = Vue & {
    validate: () => boolean;
};

export function validateForm(form: VForm): boolean {
    return form.validate();
}