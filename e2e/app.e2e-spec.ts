import { CloudCourseWebPage } from './app.po';

describe('cloud-course-web App', () => {
  let page: CloudCourseWebPage;

  beforeEach(() => {
    page = new CloudCourseWebPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
