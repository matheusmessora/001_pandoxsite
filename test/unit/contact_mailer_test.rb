require 'test_helper'

class ContactMailerTest < ActionMailer::TestCase
	test "returns mail object" do
		mail = ContactMailer.welcome "mmm", "abc@gmail.com"

		assert_not_nil mail

    assert_not_nil mail.to
    assert_not_nil mail.from

    
	end

  test "validade nome empty" do

    assert_raise(BusinessError) do
      ContactMailer.welcome "mmm", ""
    end


    assert_raise BusinessError do
      ContactMailer.welcome "mmm", "abcde"
    end
  end
end
