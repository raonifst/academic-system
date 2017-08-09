const commomMsgUpload = Object.freeze({
  msgErrorInvalidCsv: "Este não é um arquivo CSV válido.",

  msgSuccessUpload: "Upload completado com sucesso!",

  msgWarningUpload: "Upload completado com sucesso! Alguns itens repetidos foram ignorados."
});

export const msgUploadCourses = Object.freeze({
  msgErrorInvalidCsv: commomMsgUpload.msgErrorInvalidCsv,

  msgSuccessUpload: commomMsgUpload.msgSuccessUpload,

  msgWarningUpload: commomMsgUpload.msgWarningUpload,

  msgErrorsUpload: "Upload parcialmente completado. Itens com erros no campo de " +
                    "pré-requisitos não foram adicionados. Corrija-os e tente novamente"
});

export const msgUploadRecords = Object.freeze({
  msgErrorInvalidCsv: commomMsgUpload.msgErrorInvalidCsv,

  msgSuccessUpload: commomMsgUpload.msgSuccessUpload,

  msgWarningUpload: commomMsgUpload.msgWarningUpload,

  msgErrorsUpload: "Upload completado com sucesso! Alguns disciplinas que não estão na " +
                    "estrutura foram ignoaradas."
});
