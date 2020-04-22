function doGet() {
  var html = HtmlService.createTemplateFromFile("frontend/index").evaluate();
  html.setTitle(names.titlePage);
  return html;
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename)
      .setSandboxMode(HtmlService.SandboxMode.IFRAME)
      .getContent();
}



