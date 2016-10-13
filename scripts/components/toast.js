/*!
 *
 * Copyright 2016 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

export class Toast {
  static create (msg, options) {
    var toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.classList.add('toast-container');
      document.body.appendChild(toastContainer);
    }

    var tag = options.tag || (Date.now().toString());
    Array.from(toastContainer.querySelectorAll(`.toast[data-tag="${tag}"]`))
        .forEach(t => {
          console.log(t);
          t.parentNode.removeChild(t);
        });

    // Make a toast...
    var toast = document.createElement('div');
    var toastContent = document.createElement('div');
    toast.classList.add('toast');
    toastContent.classList.add('toast__content');
    toastContent.textContent = msg;
    toast.appendChild(toastContent);
    toast.dataset.tag = tag;
    toastContainer.appendChild(toast);

    // Wait a few seconds, then fade it...
    var timeout = options.timeout || 3000;
    setTimeout(function () {
      toast.classList.add('toast--dismissed');
    }, timeout);

    // After which, remove it altogether.
    toast.addEventListener('transitionend', function (evt) {
      evt.target.parentNode.removeChild(evt.target);
    });
  }
}
