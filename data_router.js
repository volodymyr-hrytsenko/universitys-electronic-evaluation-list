function getRouterInstituteId(instituteId) {
  try {
    const routsheet = SpreadsheetApp.openById(mainRouter.id).getSheetByName(mainRouter.sheet);
    let routerInstituteId = routsheet.getRange(instituteId, 1).getValue();
    if (routerInstituteId == '') { //якщо не існує ідентифікатора роутера інституту то створюємо новий документ
      routerInstituteId = createFileSpreadsheet(router.idFolderRouters, instituteId);
      //ід нового документу записуємо до роутера
      routsheet.getRange(instituteId, 1).setValue(routerInstituteId);
    }
    return routerInstituteId;
  } catch (e) {
      return {
        success: false,
        message: 'Error: ' + e.toString()
      };
    }  
}

function getInstituteOfficials(instituteId) {
  try {
    const routsheet = SpreadsheetApp.openById(mainRouter.id).getSheetByName(mainRouter.sheet);
    let officials = routsheet.getRange(instituteId, 2, 1, 2).getValues()[0];
    return {
      director: officials[0],
      secretary: officials[1]
    };
  } catch (e) {
      return {
        success: false,
        message: 'Error: ' + e.toString()
      };
    }
}

function setInstituteOfficials(instituteId, officialsObj) {
  try {
    const routsheet = SpreadsheetApp.openById(mainRouter.id).getSheetByName(mainRouter.sheet);
    let officials = routsheet.getRange(instituteId, 2, 1, 2).setValues([[officialsObj.director, officialsObj.secretary]]);
    return {
      success: true
    };
  } catch (e) {
      return {
        success: false,
        message: 'Error: ' + e.toString()
      };
    }
}

function writeDataToInstituteRouter(obj) {
  try {
    const routerInstituteId = getRouterInstituteId(obj.instituteId);
    const sheetName = studyYear.getCurrentSheetsName();
    let currentSheet = SpreadsheetApp.openById(routerInstituteId).getSheetByName(sheetName);
    if (obj.recordNumber !== -1) {
      currentSheet.getRange(obj.recordNumber, 1).setValue(JSON.stringify(obj));
    } else {
      if (!currentSheet) currentSheet = SpreadsheetApp.openById(routerInstituteId).insertSheet(sheetName);
      obj.uid = uid(); // додавання до запису унікального ідентифікатора
      currentSheet.appendRow([JSON.stringify(obj)]);
      obj.recordNumber = searchRecordInSheet(obj.uid, currentSheet);
      currentSheet.getRange(obj.recordNumber, 1).setValue(JSON.stringify(obj));
    }
    return {
      recordNumber: obj.recordNumber,
      uid: obj.uid,
      status: obj.status
    };
  } catch (e) {
    return 'Error: ' + e.toString();
  }
}

function searchRecordInSheet(uId, currentSheet) {
  //визначення порядкового номера рядка, що містить запис з унікальним ідентифікатором
  let list = currentSheet.getRange(1, 1, currentSheet.getRange("A1").getDataRegion().getLastRow(), 1).getValues();
  let recordNumber = 0;
  for (let i = list.length; i > 0; i--) {
    if (JSON.parse(list[i - 1]).uid == uId) {
      recordNumber = i;
      break;
    }
  }
  return recordNumber;
}

function writeRegistrationNumberToEvList(obj) {
  try {
    const routerInstituteId = getRouterInstituteId(obj.instituteId);
    const sheetName = studyYear.getCurrentSheetsName();
    let currentSheet = SpreadsheetApp.openById(routerInstituteId).getSheetByName(sheetName);
    let record = currentSheet.getRange(obj.recordNumber, 1).getValue();
    let recordObj = JSON.parse(record);
    recordObj.evaluationListData.listNumber = obj.listNumber;
    currentSheet.getRange(obj.recordNumber, 1).setValue(JSON.stringify(recordObj));
  
    return {
      instituteId: obj.instituteId,
      recordNumber: obj.recordNumber,
      listNumber: obj.listNumber
    };
  } catch (e) {
    return 'Error: ' + e.toString();
  }
}

function createEvaluationList(data, newFileName) {
  let evList = JSON.parse(JSON.stringify(data));
  const evaluationListId = createCopySpreadsheet(router.idEvaluationListsFolder, router.templateId, newFileName);
  const evaluationList = SpreadsheetApp.openById(evaluationListId);
  evList.date = Utilities.formatDate(new Date(evList.date), "Europe/Kiev", "dd.MM.yyyy");
  evList.institute = evList.institute.toUpperCase();// текст великими літерами
  evList.controlForm = evList.controlForm.toLowerCase();//текст прописними літерами
  if(evList.controlForm !== "екзамен") evList.controlForm = "залік";
  evList.educationalDegree = evList.educationalDegree.toLowerCase();
  evList.educationalForm = evList.educationalForm.toLowerCase();
  let academicDiscipline = chunkString(evList.academicDiscipline, 80);// розбиття довгого рядка  
  evList.academicDiscipline = academicDiscipline[0];
  evList.academicDisciplineContinuation = (typeof academicDiscipline[1] !== "undefined") ? academicDiscipline[1] : "";
  if (evList.specialization_label !=="") evList.speciality += ` (${evList.specialization_label})`;
  let sheet = evaluationList.getSheetByName("1");
  for (let key in evList) {
    let range = propertyToRange[key];
    if (key === 'students') {
      let students = evList.students;
      let rangeNum = 23;
      students.forEach(function (student, ind) {
        if (ind >= 14) {
          rangeNum = -11;
          sheet = evaluationList.getSheetByName("2");
        }
        let position = ind + rangeNum;
        sheet.getRange('B' + position).setValue(getInitials(student.name));
        sheet.getRange('D' + position).setValue(student.gradebookNumber);
        sheet.getRange('E' + position).setValue(student.currentGrade);
        sheet.getRange('F' + position).setValue(student.semesterGrade);
      });
      sheet = evaluationList.getSheetByName("1");
    } else if (key === 'aditionalTeachers') {
      let teachers = evList[key].join(', ');
      sheet.getRange(range).setValue(teachers);
    } else if (range) {
      sheet.getRange(range).setValue(evList[key]);
    }
  }
  //evaluationList;
  return evaluationListId;
}



function spreedshetToPDF(SpreadsheetId, pdfFileName) {
  try {
    // SpreadsheetId = '1aiABIEYCX21uouznbSqBUxIfrpDMA8CM8cRIWLrvvcM';
    let folder = DriveApp.getFolderById(router.pdfFolder);
    let spreedsheets = SpreadsheetApp.openById(SpreadsheetId);
    let theBlob = spreedsheets.getBlob().getAs('application/pdf').setName(pdfFileName + ".pdf");
    let newFile = folder.createFile(theBlob);
    let newFileId = newFile.getId();
    // DriveApp.getFileById(destSpreadSheet.getId()).setTrashed(true);//видалення файлу в корзину
    let urlFile = DriveApp.getFolderById(newFileId).getUrl();
    DriveApp.getFileById(newFileId).setSharing(DriveApp.Access.DOMAIN_WITH_LINK, DriveApp.Permission.VIEW); //розшарювання файлу
   // return newFileId;
    return {"url": urlFile, "id": newFileId};
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

function subscribeEvolutionsList(obj) {
  try {
    obj.spreadsheetId = createEvaluationList(obj.evaluationListData, `${obj.evaluationListData.groupName} ${obj.evaluationListData.academicDiscipline}`);
    writeDataToInstituteRouter(obj);
    return obj;
  } catch (e) {
    return 'Error: ' + e.toString();
  }
}

function cancelSignatureEvolutionsList(obj) {
  try {
    let spreadSheetId = obj.spreadsheetId,
        pdfId = obj.pdfId;
    obj.status = 0;
    obj.pdfUrl = "";
    obj.pdfId = "";
    obj.spreadsheetId = "";
    writeDataToInstituteRouter(obj);
    DriveApp.getFileById(spreadSheetId).setTrashed(true);//видалення файлу в корзину
    DriveApp.getFileById(pdfId).setTrashed(true);
    return obj;
  } catch (e) {
    return 'Error: ' + e.toString();
  }
}


function sendPdfToEmail(obj) {
  try {
    let emailParametrs = {
      pdfName: obj.evaluationListData.groupName + " " + obj.evaluationListData.academicDiscipline,
      title: "Відомість(" + obj.evaluationListData.groupName + " " + obj.evaluationListData.academicDiscipline + ")",
      description: "Роздрукуйте і підпишить. Передайте до дирекції " + obj.evaluationListData.institute,
      resourseName: "е-Відомість ЧНУ"
    };
    
    let filePDF = spreedshetToPDF(obj.spreadsheetId, emailParametrs.pdfName);
    obj.pdfId = filePDF.id;
    obj.pdfUrl = filePDF.url;
    writeDataToInstituteRouter(obj);
    sendEmail(getUser().email, emailParametrs.title, emailParametrs.description, emailParametrs.resourseName, obj.pdfId);
    return true;
  } catch (e) {
    return 'Error: ' + e.toString();
  }
}
//============================================================

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0,
      v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function uid() {
  let x = new Date().getTime();
  return x + '-' + uuidv4();
}

//====================================================================

function getInitials (str) {//перетворення рядка з Прізвищем іменем і по батькові у прізвище й ініціали
    str = str.replace(/ +/g, ' ').trim();// знищення зайвих пропусків у рядку
    let names = str.split(' '), result;
        switch(names.length){
          case 2:
            result = str.replace(/(\S+) (\S)\S*/, "$1 $2.");
          break;
          case 3:
            result = str.replace(/(\S+) (\S)\S* (\S)\S*/, "$1 $2. $3.");
          break;
          case 4:
            result = str.replace(/(\S+) (\S)\S* (\S)\S* (\S)\S*/, "$1 $2. $3. $4.");
          break;
          default:
           result = str;
        }        
    return result;
};

function chunkString(str, len) {// розбиття рядка довжина якого більша len на підрядки
  str = str.replace(/ +/g, ' ').trim();// знищення зайвих пропусків у рядку
  let words = str.split(' '), result = [], lines = [], index = 0, currentLen = 0;
  lines[0] = [];
  for(let i = 0; i < words.length; i++){
    if (currentLen + words[i].length + 1 > len) {index++; lines[index] = []; currentLen = 0;}    
    lines[index].push(words[i]);
    currentLen = currentLen + words[i].length + 1;
  }
  result = lines.map(el => {return el.join(" ")});
  return result;
}

