<script setup lang="ts"></script>

<template>
  <div class="thank-you">
    <div>
      <img src="@/assets/images/icon-thank-you.svg" alt="Thank you" />
    </div>
    <h2>Thank you!</h2>
    <p>
      Thanks for confirming your subscription!We hope you have fun using our platform.If you ever
      need support,please feel free to email us at support@loremgaming.com.
    </p>
  </div>
</template>

<style lang="scss" scoped>
.thank-you {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 15px;
  height: 100%;

  h2 {
    font-weight: bold;
  }

  p {
    color: var(--color-cool-gray);
    font-size: 14px;
    text-align: center;
  }
}

@media (max-width: 767px) {
  .thank-you {
    p {
      font-size: 16px;
    }
  }
}
</style>
