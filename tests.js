function runTeam(){
  log(getEvolutionListsByTeacherTeams(5));
  log(getEvolutionListsByTeacherTeams(5).length);
}

const testEvaluationListData = { //Тестові данні для створення відомості
  listNumber: 1,
  institute: "Навчально-науковий інститут інформаційних та освітніх технологій",
  academicDiscipline: 'Вища математика',
  controlForm: 'екзамен',
  date: '19/04/2020',
  speciality: "151 АВТОМАТИЗАЦІЯ ТА КОМП'ЮТЕРНО-ІНТЕГРОВАНІ ТЕХНОЛОГІЇ",
  educationalProgram: "АВТОМАТИЗАЦІЯ ТА КОМП'ЮТЕРНО-ІНТЕГРОВАНІ ТЕХНОЛОГІЇ",
  educationalDegree: 'бакалавр',
  educationalForm: 'денна',
  groupName: '2-В',
  teacherFullName: 'Босовський Микола Васильович',
  aditionalTeachers: ["Босовський Микола Васильович", "Босовський Микола Васильович"],
  students: [{
      name: "Шевелев Олексій Тимофійович",
      gradebookNumber: 150310,
      groupId: 5,
      currentGrade: 65,
      semesterGrade: 63,
    },
    {
      name: "Панкратов Игор Тимофійович",
      gradebookNumber: 877280,
      groupId: 5,
      currentGrade: 89,
      semesterGrade: 90,
    },
    {
      name: "Пономарев Игор Віталійович",
      gradebookNumber: 739066,
      groupId: 5,
      currentGrade: 67,
      semesterGrade: 74,
    },
    {
      name: "Кузнецов Роберт Богданович",
      gradebookNumber: 946587,
      groupId: 5,
      currentGrade: 80,
      semesterGrade: 81,
    },
    {
      name: "Князев Артем Владиславович",
      gradebookNumber: 009735,
      groupId: 5,
      currentGrade: 77,
      semesterGrade: 85,
    },
    {
      name: "Шевелев Олексій Тимофійович",
      gradebookNumber: 150310,
      groupId: 5,
      currentGrade: 65,
      semesterGrade: 63,
    },
    {
      name: "Панкратов Игор Тимофійович",
      gradebookNumber: 877280,
      groupId: 5,
      currentGrade: 89,
      semesterGrade: 90,
    },
    {
      name: "Пономарев Игор Віталійович",
      gradebookNumber: 739066,
      groupId: 5,
      currentGrade: 67,
      semesterGrade: 74,
    },
    {
      name: "Кузнецов Роберт Богданович",
      gradebookNumber: 946587,
      groupId: 5,
      currentGrade: 80,
      semesterGrade: 81,
    },
    {
      name: "Князев Артем Владиславович",
      gradebookNumber: 009735,
      groupId: 5,
      currentGrade: 77,
      semesterGrade: 85,
    },
    {
      name: "Шевелев Олексій Тимофійович",
      gradebookNumber: 150310,
      groupId: 5,
      currentGrade: 65,
      semesterGrade: 63,
    },
    {
      name: "Панкратов Игор Тимофійович",
      gradebookNumber: 877280,
      groupId: 5,
      currentGrade: 89,
      semesterGrade: 90,
    },
    {
      name: "Пономарев Игор Віталійович",
      gradebookNumber: 739066,
      groupId: 5,
      currentGrade: 67,
      semesterGrade: 74,
    },
    {
      name: "Кузнецов Роберт Богданович",
      gradebookNumber: 946587,
      groupId: 5,
      currentGrade: 80,
      semesterGrade: 81,
    },
    {
      name: "Князев Артем Владиславович",
      gradebookNumber: 009735,
      groupId: 5,
      currentGrade: 77,
      semesterGrade: 85,
    },
  ]
}

//

// function sendEmail(spredsheetId, email, pdfName, messageTitle, messageBody, organization) {
//   const ss = SpreadsheetApp.openById(spredsheetId);
//   let sheet = ss.getSheets()[0];
//   let sheetPdf = ss.getSheets()[1];

//   let data = sheet.getRange(...pageRange.mainPage).getValues();

//   let folderID = router.pdfFolder;
//   let folder = DriveApp.getFolderById(folderID);

//   let destSpreadSheet = SpreadsheetApp.open(DriveApp.getFileById(ss.getId()).makeCopy("tmp_pdf", folder));
//   let sheetsPdf = destSpreadSheet.getSheets();

//   let theBlob = destSpreadSheet.getBlob().getAs('application/pdf').setName(pdfName);
//   let newFile = folder.createFile(theBlob);
//   let newFileId = newFile.getId();

//   DriveApp.getFileById(destSpreadSheet.getId()).setTrashed(true);

//   if (1) {
//     GmailApp.sendEmail(email, messageTitle, messageBody, {
//       name: organization,
//       attachments: [DriveApp.getFileById(newFileId)]
//     });
//   }
//   return newFileId
// }
/*
function sendEmailOLD(id, email, pdfName, messageTitle, messageBody, organization) {
  try {
    const ss = SpreadsheetApp.openById(id);
    //let sheet = ss.getSheets()[0];
    // let sheetPdf = ss.getSheets()[1];

    // let data = sheet.getRange(...pageRange.mainPage).getValues();

    let folderID = router.pdfFolder;
    let folder = DriveApp.getFolderById(folderID);

    let destSpreadSheet = SpreadsheetApp.open(DriveApp.getFileById(ss.getId()).makeCopy("tmp_pdf", folder));
    let sheetsPdf = destSpreadSheet.getSheets();

    let theBlob = destSpreadSheet.getBlob().getAs('application/pdf').setName(pdfName);
    let newFile = folder.createFile(theBlob);
    let newFileId = newFile.getId();

    DriveApp.getFileById(destSpreadSheet.getId()).setTrashed(true);

    if (1) {
      GmailApp.sendEmail(email, messageTitle, messageBody, {
        name: organization,
        attachments: [DriveApp.getFileById(newFileId)]
      })
    }
    return newFileId
  } catch (e) {
    return 'Error: sending mail ' + e.toString();
  }
}

*/


/*
function spreedshetToPDF(SpreadsheetId, pdfFileName){
   try {
             let folder = DriveApp.getFolderById(router.pdfFolder); 
             let spreedsheets = SpreadsheetApp.openById(SpreadsheetId);
             let theBlob = spreedsheets.getBlob().getAs('application/pdf').setName(pdfFileName);
             let newFile = folder.createFile(theBlob);
             let newFileId = newFile.getId();
             return newFileId;
   } catch (e) {
    return 'Error: sending mail ' + e.toString();
  }   
}
function sendEmail(email, messageTitle, messageBody, organization, attachmentFileId) {
  try {
       GmailApp.sendEmail(email, messageTitle, messageBody, {
        name: organization,
        attachments: [DriveApp.getFileById(attachmentFileId)]
      });
   return true;
  } catch (e) {
    return 'Error: sending mail ' + e.toString();
  }
}

             
             function testPDF (){
             SpreadsheetId = '1IZRLl90nOxtBlnpwelhbJ95lXzRKpTOt6uK32bYci80';
             pdfFileName = "wer";
             let attachmentFileId = spreedshetToPDF(SpreadsheetId, pdfFileName);
             sendEmail(email, messageTitle, messageBody, organization, attachmentFileId);
             } 
*/

const arr = [];

if (arr.length > 0) arr.forEach();