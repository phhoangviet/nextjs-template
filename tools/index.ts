import * as fs from 'fs';
import { last, startCase } from 'lodash';

const generateNameOfComponent = (pathName: string) => {
  let name = '';
  const splitPathName = pathName.split('/');
  const lastNameComp = last(splitPathName);
  const preLastComp = splitPathName[splitPathName.length - 2];
  if (splitPathName.length <= 1) {
  } else {
    if (last(preLastComp) == 's') {
      name = preLastComp.slice(0, preLastComp.length - 1);
    }
  }
  name = startCase(lastNameComp) + startCase(name);
  return name;
};

(async () => {
  const componentsPath = './components';
  const templatesBasePath = `${componentsPath}/templates/base`;
  const outPath = process.argv.slice(2);
  const pathGenerate = outPath[0];
  if (fs.existsSync(`${componentsPath}/${pathGenerate}`)) {
    console.error('component is existed. please choose another name of folder');
  } else {
    fs.mkdirSync(`${componentsPath}/${pathGenerate}`, { recursive: true });
  }
  const nameOfCompoent = generateNameOfComponent(pathGenerate);
  fs.readdir(templatesBasePath, (err, files) => {
    files.forEach((file) => {
      const nameFile = file.replace('BaseTemplate', nameOfCompoent);
      const extFile = nameFile.slice(nameFile.indexOf('.'), nameFile.length);
      fs.readFile(`${templatesBasePath}/${file}`, 'utf8', (err, data) => {
        const customData =
          `/* File is auto generated base on BaseTemplate. Author: Viet Pham. Version: 0.1 */\n` +
          data.replace(new RegExp('BaseTemplate', 'g'), nameOfCompoent);
        fs.writeFileSync(
          `${componentsPath}/${pathGenerate}/${nameOfCompoent}${extFile}`,
          customData
        );
      });
    });
  });
})();
