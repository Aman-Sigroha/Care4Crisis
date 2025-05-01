import { publish } from 'gh-pages';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

publish(
  'dist',
  {
    branch: 'gh-pages',
    repo: 'https://github.com/Aman-Sigroha/Care4Crisis.git',
    user: {
      name: 'GitHub Pages Bot',
      email: 'github-pages-bot@users.noreply.github.com'
    },
    dotfiles: true
  },
  (err) => {
    if (err) {
      console.error('Deployment failed:', err);
    } else {
      console.log('Successfully deployed!');
    }
  }
); 