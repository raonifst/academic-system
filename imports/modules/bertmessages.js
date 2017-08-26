const commomMsgUpload = Object.freeze({
  errorInvalidCsv: "Este não é um arquivo CSV válido.",

  successUpload: "Upload completado com sucesso!",

  warningUpload: "Upload completado com sucesso! Alguns itens repetidos foram ignorados."
});

export const msgUploadCourses = Object.freeze({
  errorInvalidCsv: commomMsgUpload.errorInvalidCsv,

  successUpload: commomMsgUpload.successUpload,

  warningUpload: commomMsgUpload.warningUpload,

  errorsUpload: "Upload parcialmente completado. Itens com erros no campo de " +
                    "pré-requisitos não foram adicionados. Corrija-os e tente novamente"
});

export const msgUploadRecords = Object.freeze({
  errorInvalidCsv: commomMsgUpload.errorInvalidCsv,

  successUpload: commomMsgUpload.successUpload,

  warningUpload: commomMsgUpload.warningUpload,

  errorsUpload: "Upload completado com sucesso! Alguns disciplinas que não estão na " +
                    "estrutura foram ignoaradas."
});

export const msgRoutes = Object.freeze({
  firstLogin: "É necessário trocar a senha padrão no primeiro login.",

  uploadCourses: "É necessário fazer upload da estrutura curricular.",

  uploadRecords: "É necessário fazer upload do histórico acadêmico."
});
