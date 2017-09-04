const commomMsgUpload = Object.freeze({
  errorInvalidCsv: "Este não é um arquivo CSV válido.",

  successUpload: "Upload completado com sucesso!",

  warningUpload: "Upload completado com sucesso! Alguns itens repetidos foram ignorados.",

  errorNotSupportedOperation: "Operação não permitida.",

  successRemoveItem: "Remoção completada com sucesso!",

  successRemove: function (label) {
    return this.successRemoveItem +
      " Adicione um(a) novo(a) " + label + " para o correto funcionamento do sistema!";
  },

  errorEmptyDataOnRemove: function (label) {
    return label + " já está vazio(a).";
  }
});

const BertMsg = Object.freeze({
  courses: Object.freeze({
    errorInvalidCsv: commomMsgUpload.errorInvalidCsv,

    successUpload: commomMsgUpload.successUpload,

    warningUpload: commomMsgUpload.warningUpload,

    errorUpload: "Upload parcialmente completado."
                  + " Itens com erros no campo de pré-requisitos não foram adicionados."
                  + " Corrija-os e tente novamente",

    errorEmptyCourses: "Estrutura curricular adicionada não contém nenhuma disciplina.",

    errorEmptyCoursesOnRemove: commomMsgUpload.errorEmptyDataOnRemove("Estrutura curricular"),

    errorNotEmptyRecordsOnRemove: commomMsgUpload.errorNotSupportedOperation
                                  + " Antes de realizar qualquer remoção"
                                  + " o histórico acadêmico deve ser excluído.",

    successRemoveItem: commomMsgUpload.successRemoveItem,

    successRemove: commomMsgUpload.successRemove("estrutura curricular")
  }),

  records: Object.freeze({
    errorInvalidCsv: commomMsgUpload.errorInvalidCsv,

    successUpload: commomMsgUpload.successUpload,

    warningUpload: commomMsgUpload.warningUpload,

    errorUpload: commomMsgUpload.successUpload
                + " Alguns disciplinas que não estão na estrutura foram ignoaradas.",

    errorEmptyRecords: "Histórico acadêmico adicionado não contém nenhum registro.",

    errorEmptyRecordsOnRemove: commomMsgUpload.errorEmptyDataOnRemove("Histórico acadêmico"),

    errorEmptyDataOnChangeUserStatus: commomMsgUpload.errorNotSupportedOperation
                                      + " Não há registros no histórico acadêmico.",

    successRemoveItem: commomMsgUpload.successRemoveItem,

    successRemove: commomMsgUpload.successRemove("histórico acadêmico")
  }),

  routes: Object.freeze({
    firstLogin: "É necessário trocar a senha padrão no primeiro login.",

    courses: "É necessário fazer upload da estrutura curricular.",

    records: "É necessário fazer upload do histórico acadêmico."
  }),

  password: Object.freeze({
    validationError: "A nova senha deve ter, ao menos: "
    + "6 (seis) caracteres, "
    + "uma letra maiúscula e uma minúscula, "
    + "um número "
    + "e um caracter especial. "
    + "Por favor, tente uma nova senha.",

    matchError: "As senhas digitadas não coincidem.",

    invarianceError: "Nova senha digitada é igual à senha antiga.",

    incorrectPasswordError: "Senha incorreta.",

    success: "Senha alterada com sucesso."
  }),

  login: Object.freeze({
    userNotFoundError: "Usuário não cadastrado."
  })
});

export default BertMsg;
