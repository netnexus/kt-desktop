import { AngularElectronPage } from './app.po';
import { browser, element, by } from 'protractor';

// You need to be logged in

describe('Kt Desktop App', () => {
  let page: AngularElectronPage;

  beforeEach(() => {
    page = new AngularElectronPage();
  });

  it('should display a link with "Neue Überweisung"', () => {
    expect(element(by.css('app-sidebar a')).getText()).toMatch('Neue Überweisung');
  });

  it('should display a link with "Aktualisieren"', async () => {
    expect(element(by.linkText('Aktualisieren')).isPresent()).toBeTruthy();
  });

  it('should display a link with "Abmelden"', async () => {
    expect(element(by.linkText('Abmelden')).isPresent()).toBeTruthy();
  });

  it('should display a link with "Export"', async () => {
    expect(element(by.linkText('Export')).isPresent()).toBeTruthy();
  });

  it('should display your iban', () => {
    expect(element(by.css('ul.uk-nav.uk-nav-default.top')).getText()).toContain('DE');
  });

  it('Test reload', () => {
    element.all(by.css('tbody tr')).count().then(function (first) {
      element(by.linkText('Aktualisieren')).click();
      browser.waitForAngular();
      element.all(by.css('tbody tr')).count().then(function (second) {
        expect(first - second).toEqual(0);
      });
    });
  });

  it('Test filter', () => {
    element(by.cssContainingText('option', '100')).click();
    const list = element.all(by.css('tbody tr'));
    expect(list.count()).toBeLessThanOrEqual(100);
  });

  it('test "Neue Überweisung"', async () => {
    await element(by.linkText('Neue Überweisung')).click();

    const handles = await browser.getAllWindowHandles();
    let newWindowHandle;
    newWindowHandle = handles[1];
    browser.switchTo().window(newWindowHandle).then(function () {
      expect(element(by.css('.uk-legend')).getText()).toMatch('Neue Überweisung');
      expect(element(by.name('recipient')).isPresent()).toBeTruthy();
      expect(element(by.name('iban')).isPresent()).toBeTruthy();
      expect(element(by.name('amount')).isPresent()).toBeTruthy();
      expect(element(by.name('note')).isPresent()).toBeTruthy();
      browser.close();
      newWindowHandle = handles[0];
      browser.switchTo().window(newWindowHandle);
    });
  });
  it('test whats-new', () => {
    element(by.partialLinkText('Version:')).click().then(function () {
      browser.getAllWindowHandles().then(function (handles) {
        let newWindowHandle;
        newWindowHandle = handles[1];
        browser.switchTo().window(newWindowHandle).then(function () {
          expect(element(by.css('body')).getText()).toContain('0.9.18');
          browser.close();
          newWindowHandle = handles[0];
          browser.switchTo().window(newWindowHandle);
        });
      });
    });
  });
  it('test export', () => {
    element(by.partialLinkText('Export')).click().then(function () {
      browser.getAllWindowHandles().then(function (handles) {
        let newWindowHandle;
        newWindowHandle = handles[1];
        browser.switchTo().window(newWindowHandle).then(function () {
          expect(element(by.css('legend')).getText()).toMatch('Export');
          browser.close();
          newWindowHandle = handles[0];
          browser.switchTo().window(newWindowHandle);
        });
      });
    });
  });
});
