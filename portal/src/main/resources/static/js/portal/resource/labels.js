import {
  _SHOW_LABEL,
  _SHOW_BUTTON,
  _HIDE_BUTTON,
} from '../common/constants.js';

function initLabelsButton(labelEntry) {
  labelEntry.push(_SHOW_BUTTON);
  return labelEntry;
}

$(document).on('click', '.show-all-btn', function(e) {
  e.preventDefault();
  showLabels($(this));
  e.stopImmediatePropagation();
});

$(document).on('click', '.hide-btn', function(e) {
  e.preventDefault();
  hideLabels($(this));
  e.stopPropagation();
});

function showLabels($this) {
  toggleHideLabel($this.closest('td'));
}

function hideLabels($this) {
  toggleShowLabel($this.closest('td'));
}

function toggleShowLabel($labelTd) {
  const $labels = $labelTd.find('p');
  $labels.each(function (index, element) {
    if (index >= _SHOW_LABEL) {
      element.className = "hide-label";
    }
    if (index === $labels.length - 1) {
      $labelTd.find('br').remove();
      $labelTd.find('.hide-btn').remove();
      $labelTd.append(_SHOW_BUTTON);
    }
  });
}

function toggleHideLabel($labelTd) {
  $labelTd.find('.hide-label').toggleClass('hide-label');
  $labelTd.find('br').remove();
  $labelTd.find('.show-all-btn').remove();
  $labelTd.append(_HIDE_BUTTON);
}

const labels = {
  initLabelsButton: initLabelsButton,
  showLabels: showLabels,
  hideLabels: hideLabels,
  toggleShowLabel: toggleShowLabel,
  toggleHideLabel: toggleHideLabel,
}

export default labels;