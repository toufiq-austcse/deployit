import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint({ name: 'valid git url', async: false })
export class IsValidGitUrl implements ValidatorConstraintInterface {
  validate(url: string) {
    if (!url) return false;
    return url.endsWith('.git');
  }

  defaultMessage() {
    return JSON.stringify({
      key: 'repository_url',
      message: 'repository_url should be a valid git url'
    });
  }
}