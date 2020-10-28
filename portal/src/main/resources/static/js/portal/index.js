// import '../../scss/material-dashboard.scss'; // Failed to load module script
// import '../../scss/portal.scss'; // Failed to load module script
import Sidebar from './router/sidebar.js';

const sb = new Sidebar('Compact Edge Portal');
console.log(sb.message);
sb.dashboard();

// https://datatables.net/reference/option/%24.fn.dataTable.ext.errMode
$.fn.dataTable.ext.errMode = 'none';  // Ignore warning message

// To Keep element active
$(document).on('click', '.nav li a', function(e) {
  // console.log(e);
  // console.log($(e.target));
  $('.username').addClass('collapsed');
  $('.username').attr('aria-expanded', 'false');
  $('.username').siblings('.collapse').removeClass('show');

  $('.nav li').each(function(i, e) {
    // console.log($(this));
    if ($(this).hasClass('active')) {
      $(this).removeClass('active');
    }
    if ($(this).find('.nav-link').attr('data-toggle') == 'collapse') {
      const $toggle = $(this).find('.nav-link');
      $toggle.addClass('collapsed');
      $toggle.attr('aria-expanded', 'false');
      $toggle.siblings('.collapse').removeClass('show');
    }
  });

  $(e.target).closest('.nav-item.menu').addClass('active');
  $(e.target).closest('.top-item').removeClass('active');
  let $collapsed = $(e.target).closest('.top-item').find('.nav-link');
  if (!$collapsed.hasClass('nav-link')) $collapsed = $(e.target).closest('.user-info').find('.username');

  if ($collapsed.attr('data-toggle') == 'collapse') {
    $collapsed.removeClass('collapsed');
    $collapsed.attr('aria-expanded', 'true');
    $collapsed.siblings('.collapse').addClass('show');
  }
});
