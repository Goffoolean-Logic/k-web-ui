/** Copyable markup for the Showcase member-profile example. */
export const showcaseProfileHtml = `<div class="k-showcase-profile">
<div class="k-card">
  <div class="k-card__header">
    <h3 class="k-card__title">Maya Chen</h3>
    <p class="k-card__subtitle">Member since March 2024</p>
  </div>
  <div class="k-card__body">
    <div class="k-showcase-profile__meta">
      <span class="k-badge k-badge--warning">Gold</span>
      <span>2,450 points toward a $25 reward.</span>
    </div>
  </div>
</div>

<k-tabs id="profile-tabs" class="k-tabs" label="Account"></k-tabs>

<template id="points-panel">
  <div class="k-showcase-profile__points">
    <k-gauge
      id="points-gauge"
      class="k-gauge"
      size="lg"
      value="2450"
      max="3000"
      label="Points"
      text="2,450"
    ></k-gauge>
    <p>2,450 of 3,000 points. The next reward is a $25 credit.</p>
  </div>
</template>

<template id="deals-panel">
  <k-carousel id="deals-carousel" class="k-carousel"></k-carousel>
</template>

<template id="deal-dining">
  <div class="k-showcase-deal">
    <span class="k-badge k-badge--success">Weekend</span>
    <h3>Double points on dining</h3>
    <p>Earn 2× at restaurants through Sunday night.</p>
    <button type="button" class="k-btn k-btn--primary k-btn--sm">Claim</button>
  </div>
</template>

<template id="deal-travel">
  <div class="k-showcase-deal">
    <img src="/travel-promo.jpg" alt="Hotel on the water at dusk">
    <span class="k-badge k-badge--primary">20% off</span>
    <h3>Fall travel</h3>
    <p>Code LEAF at checkout, through October.</p>
    <button type="button" class="k-btn k-btn--primary k-btn--sm">Claim</button>
  </div>
</template>

<template id="deal-merch">
  <div class="k-showcase-deal">
    <span class="k-badge k-badge--warning">Gold</span>
    <h3>Merch drop, a day early</h3>
    <p>Gold members shop the fall drop before it goes public.</p>
    <button type="button" class="k-btn k-btn--primary k-btn--sm">Claim</button>
  </div>
</template>

<template id="activity-panel">
  <table class="k-table k-table--zebra">
    <thead>
      <tr>
        <th>Date</th>
        <th>Activity</th>
        <th>Amount</th>
        <th>Details</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>14 Sep</td>
        <td>Redeemed 500 points</td>
        <td>−500 pts</td>
        <td>
          <button type="button" class="k-btn k-btn--secondary k-btn--sm" popovertarget="activity-redeem">
            Show
          </button>
        </td>
      </tr>
      <tr>
        <td>11 Sep</td>
        <td>Referral bonus</td>
        <td>+250 pts</td>
        <td>
          <button type="button" class="k-btn k-btn--secondary k-btn--sm" popovertarget="activity-referral">
            Show
          </button>
        </td>
      </tr>
      <tr>
        <td>8 Sep</td>
        <td>Order #1842</td>
        <td>+84 pts</td>
        <td>
          <button type="button" class="k-btn k-btn--secondary k-btn--sm" popovertarget="activity-order">
            Show
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<dialog id="activity-redeem" class="k-modal" popover>
  <button type="button" class="k-modal__scrim" popovertarget="activity-redeem" popovertargetaction="hide" aria-label="Close"></button>
  <div class="k-modal__box">
    <h3 class="k-modal__title">Redeemed 500 points</h3>
    <p class="k-modal__body">14 Sep. A $10 dining credit at Harbor Kitchen. It's in her wallet now.</p>
    <div class="k-modal__actions">
      <button type="button" class="k-btn k-btn--ghost" popovertarget="activity-redeem" popovertargetaction="hide">
        Close
      </button>
    </div>
  </div>
</dialog>

<dialog id="activity-referral" class="k-modal" popover>
  <button type="button" class="k-modal__scrim" popovertarget="activity-referral" popovertargetaction="hide" aria-label="Close"></button>
  <div class="k-modal__box">
    <h3 class="k-modal__title">Referral bonus</h3>
    <p class="k-modal__body">11 Sep. Jordan K. joined with Maya's code. The bonus posted the same day.</p>
    <div class="k-modal__actions">
      <button type="button" class="k-btn k-btn--ghost" popovertarget="activity-referral" popovertargetaction="hide">
        Close
      </button>
    </div>
  </div>
</dialog>

<dialog id="activity-order" class="k-modal" popover>
  <button type="button" class="k-modal__scrim" popovertarget="activity-order" popovertargetaction="hide" aria-label="Close"></button>
  <div class="k-modal__box">
    <h3 class="k-modal__title">Order #1842</h3>
    <p class="k-modal__body">8 Sep. Two pour-over kits. She paid $42.00. Points landed at pickup.</p>
    <div class="k-modal__actions">
      <button type="button" class="k-btn k-btn--ghost" popovertarget="activity-order" popovertargetaction="hide">
        Close
      </button>
    </div>
  </div>
</dialog>

</div>

<script type="module">
  import 'k-web-ui/js';

  const tabs = document.getElementById('profile-tabs');
  const clone = (id) => document.getElementById(id).content.cloneNode(true);

  tabs.panels = [
    { label: 'Points', content: clone('points-panel') },
    { label: 'Deals', content: clone('deals-panel') },
    { label: 'Activity', content: clone('activity-panel') },
  ];

  const carousel = document.getElementById('deals-carousel');
  carousel.slides = [
    { content: clone('deal-dining') },
    { content: clone('deal-travel') },
    { content: clone('deal-merch') },
  ];

  const syncDeals = (selected) => {
    if (selected === 1) carousel.play();
    else carousel.pause();
  };

  syncDeals(0);
  tabs.addEventListener('k-change', (event) => {
    syncDeals(event.detail.selected);
  });
</script>
`;
