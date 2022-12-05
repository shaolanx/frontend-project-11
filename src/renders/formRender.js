const formRenderSuccess = (elements, i18n) => {
  const {
    input,
    form,
    feedback,
    submitButton,
  } = elements;
  submitButton.disabled = false;
  input.classList.remove('is-invalid');
  feedback.classList.remove('text-danger');
  feedback.classList.add('text-success');
  feedback.textContent = i18n.t('feedback.success');
  form.reset();
  input.focus();
};

const formRenderError = (state, elements, i18n) => {
  const { input, feedback, submitButton } = elements;
  submitButton.disabled = false;
  input.classList.add('is-invalid');
  feedback.classList.remove('text-success');
  feedback.classList.add('text-danger');
  feedback.textContent = i18n.t([`feedback.${state.form.error}`, 'feedback.invalidUnknown']);
};

export default (state, elements, i18n) => {
  switch (state.form.status) {
    case 'sending':
      elements.submitButton.disabled = true;
      break;
    case 'finished':
      formRenderSuccess(elements, i18n);
      break;
    case 'failed':
      formRenderError(state, elements, i18n);
      break;
    default:
      throw new Error(`Unknown state: ${state.formStatus}`);
  }
};
